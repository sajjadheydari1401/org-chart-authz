import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { RoleScopeMode } from './entities/role.entity.js';
import { RolesService } from './roles.service.js';

describe('RolesService', () => {
  const input = {
    name: 'manager',
    description: 'requested description',
    unitId: 7,
    scopeMode: RoleScopeMode.SELF,
  };
  const unit = { id: 7, name: 'Finance', type: 'department' };
  let roles: {
    find: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let units: { findOneBy: ReturnType<typeof vi.fn> };
  let provider: { createRole: ReturnType<typeof vi.fn> };
  let service: RolesService;

  beforeEach(() => {
    roles = {
      find: vi.fn(),
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => ({ id: 1, ...value })),
    };
    units = { findOneBy: vi.fn().mockResolvedValue(unit) };
    provider = {
      createRole: vi.fn().mockResolvedValue({
        id: 'role-id',
        name: 'Manager',
        description: 'provider description',
      }),
    };
    service = new RolesService(
      roles as never,
      units as never,
      provider as unknown as AuthorizationProviderService,
    );
  });

  it('lists roles from the local repository without calling the provider', async () => {
    const localRoles = [{ id: 1, name: 'manager' }];
    roles.find.mockResolvedValue(localRoles);

    await expect(service.getAllRoles()).resolves.toBe(localRoles);
    expect(roles.find).toHaveBeenCalledExactlyOnceWith();
    expect(provider.createRole).not.toHaveBeenCalled();
  });

  it.each([RoleScopeMode.SELF, RoleScopeMode.DESCENDANTS])(
    'saves provider values with the local unit and requested %s scope',
    async (scopeMode) => {
      const expected = {
        name: 'Manager',
        description: 'provider description',
        providerId: 'role-id',
        unit,
        scopeMode,
      };
      await expect(
        service.createRole({ ...input, scopeMode }),
      ).resolves.toEqual({
        id: 1,
        ...expected,
      });
      expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: 7 });
      expect(provider.createRole).toHaveBeenCalledExactlyOnceWith(
        input.name,
        input.description,
      );
      expect(roles.create).toHaveBeenCalledExactlyOnceWith(expected);
      expect(roles.save).toHaveBeenCalledExactlyOnceWith(expected);
    },
  );

  it('waits for provider success before inserting locally', async () => {
    provider.createRole.mockImplementation(async () => {
      await Promise.resolve();
      expect(roles.create).not.toHaveBeenCalled();
      expect(roles.save).not.toHaveBeenCalled();
      return { id: 'role-id', name: 'manager', description: 'description' };
    });
    await service.createRole(input);
    expect(roles.save).toHaveBeenCalledOnce();
  });

  it('does not insert when the provider fails', async () => {
    const error = new Error('provider failed');
    provider.createRole.mockRejectedValue(error);
    await expect(service.createRole(input)).rejects.toBe(error);
    expect(roles.create).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('does not call the provider when the unit is missing', async () => {
    units.findOneBy.mockResolvedValue(null);
    await expect(service.createRole(input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(provider.createRole).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });
});
