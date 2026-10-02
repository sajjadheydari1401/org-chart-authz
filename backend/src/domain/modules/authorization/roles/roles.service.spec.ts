import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { RoleScopeMode } from './entities/role.entity.js';
import { RolesService } from './roles.service.js';

describe('RolesService', () => {
  const unitId = '550e8400-e29b-41d4-a716-446655440001';
  const updatedUnitId = '550e8400-e29b-41d4-a716-446655440002';
  const roleId = '550e8400-e29b-41d4-a716-446655440010';
  const missingRoleId = '550e8400-e29b-41d4-a716-446655440404';
  const input = {
    name: 'manager',
    farsiName: 'مدیر سازمان',
    description: 'requested description',
    unitId,
    scopeMode: RoleScopeMode.SELF,
  };
  const unit = { id: unitId, name: 'Finance', type: 'department' };
  let roles: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let units: { findOneBy: ReturnType<typeof vi.fn> };
  let provider: {
    createRole: ReturnType<typeof vi.fn>;
    updateRole: ReturnType<typeof vi.fn>;
    deleteRole: ReturnType<typeof vi.fn>;
  };
  let service: RolesService;

  beforeEach(() => {
    roles = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => ({ id: roleId, ...value })),
    };
    units = { findOneBy: vi.fn().mockResolvedValue(unit) };
    provider = {
      createRole: vi.fn().mockResolvedValue({
        id: 'role-id',
        name: 'Manager',
        description: 'provider description',
      }),
      updateRole: vi.fn().mockResolvedValue({
        id: 'updated-provider-role-id',
        name: 'Updated Manager',
        description: 'updated provider description',
      }),
      deleteRole: vi.fn().mockResolvedValue(undefined),
    };
    service = new RolesService(
      roles as never,
      units as never,
      provider as unknown as AuthorizationProviderService,
    );
  });

  it('lists roles from the local repository without calling the provider', async () => {
    const localRoles = [{ id: roleId, name: 'manager' }];
    roles.find.mockResolvedValue(localRoles);

    await expect(service.getAllRoles()).resolves.toBe(localRoles);
    expect(roles.find).toHaveBeenCalledExactlyOnceWith();
    expect(provider.createRole).not.toHaveBeenCalled();
  });

  it('finds a local role by its English name', async () => {
    const role = { id: 'role-id', name: 'manager' };
    roles.findOneBy.mockResolvedValue(role);

    await expect(service.getRoleByName('manager')).resolves.toBe(role);
    expect(roles.findOneBy).toHaveBeenCalledExactlyOnceWith({
      name: 'manager',
    });
  });

  it('rejects an unknown local role name', async () => {
    roles.findOneBy.mockResolvedValue(null);

    await expect(service.getRoleByName('unknown')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it.each([RoleScopeMode.SELF, RoleScopeMode.DESCENDANTS])(
    'saves provider values with the local unit and requested %s scope',
    async (scopeMode) => {
      const expected = {
        name: 'Manager',
        farsiName: input.farsiName,
        description: 'provider description',
        providerId: 'role-id',
        unit,
        scopeMode,
      };
      await expect(
        service.createRole({ ...input, scopeMode }),
      ).resolves.toEqual({
        id: roleId,
        ...expected,
      });
      expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: unitId });
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

  it('deletes the provider role if saving the local role fails', async () => {
    const localSaveError = new Error('local role save failed');
    roles.save.mockRejectedValue(localSaveError);

    await expect(service.createRole(input)).rejects.toBe(localSaveError);
    expect(provider.deleteRole).toHaveBeenCalledExactlyOnceWith('role-id');
  });

  it('does not call the provider when the unit is missing', async () => {
    units.findOneBy.mockResolvedValue(null);
    await expect(service.createRole(input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(provider.createRole).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('updates the provider first and saves its values with the requested unit and scope', async () => {
    const role = {
      id: roleId,
      providerId: 'provider-role-id',
      name: 'Manager',
      description: 'original description',
      farsiName: 'مدیر قبلی',
      unit: { id: unitId },
      scopeMode: RoleScopeMode.SELF,
    };
    const updatedInput = {
      ...input,
      unitId: updatedUnitId,
      scopeMode: RoleScopeMode.DESCENDANTS,
    };
    const updatedUnit = {
      id: updatedUnitId,
      name: 'Operations',
      type: 'department',
    };
    roles.findOneBy.mockResolvedValue(role);
    units.findOneBy.mockResolvedValue(updatedUnit);
    provider.updateRole.mockImplementation(async () => {
      expect(roles.save).not.toHaveBeenCalled();
      return {
        id: 'updated-provider-role-id',
        name: 'Updated Manager',
        description: 'updated provider description',
      };
    });

    await expect(service.updateRole(roleId, updatedInput)).resolves.toEqual({
      ...role,
      providerId: 'updated-provider-role-id',
      name: 'Updated Manager',
      farsiName: updatedInput.farsiName,
      description: 'updated provider description',
      unit: updatedUnit,
      scopeMode: RoleScopeMode.DESCENDANTS,
    });
    expect(roles.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: roleId });
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({
      id: updatedUnitId,
    });
    expect(provider.updateRole).toHaveBeenCalledExactlyOnceWith(
      'provider-role-id',
      updatedInput.name,
      updatedInput.description,
    );
    expect(roles.save).toHaveBeenCalledExactlyOnceWith({
      ...role,
      providerId: 'updated-provider-role-id',
      name: 'Updated Manager',
      farsiName: updatedInput.farsiName,
      description: 'updated provider description',
      unit: updatedUnit,
      scopeMode: RoleScopeMode.DESCENDANTS,
    });
  });

  it('does not look up the unit or call the provider when the role is missing', async () => {
    roles.findOneBy.mockResolvedValue(null);

    await expect(
      service.updateRole(missingRoleId, input),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.findOneBy).not.toHaveBeenCalled();
    expect(provider.updateRole).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('does not call the provider when the requested unit is missing', async () => {
    roles.findOneBy.mockResolvedValue({
      id: roleId,
      providerId: 'provider-role-id',
    });
    units.findOneBy.mockResolvedValue(null);

    await expect(service.updateRole(roleId, input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(provider.updateRole).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('does not update the local role when the provider update fails', async () => {
    roles.findOneBy.mockResolvedValue({
      id: roleId,
      providerId: 'provider-role-id',
    });
    const error = new Error('provider update failed');
    provider.updateRole.mockRejectedValue(error);

    await expect(service.updateRole(roleId, input)).rejects.toBe(error);
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('deletes the local role only after provider deletion succeeds', async () => {
    roles.findOneBy.mockResolvedValue({
      id: roleId,
      providerId: 'provider-role-id',
    });
    const calls: string[] = [];
    provider.deleteRole.mockImplementation(async () => {
      expect(roles.delete).not.toHaveBeenCalled();
      calls.push('provider');
    });
    roles.delete.mockImplementation(async () => {
      calls.push('local');
      return { affected: 1 };
    });

    await expect(service.deleteRole(roleId)).resolves.toBeUndefined();
    expect(roles.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: roleId });
    expect(provider.deleteRole).toHaveBeenCalledExactlyOnceWith(
      'provider-role-id',
    );
    expect(roles.delete).toHaveBeenCalledExactlyOnceWith(roleId);
    expect(calls).toEqual(['provider', 'local']);
  });

  it('does not call the provider or delete locally when the role is missing', async () => {
    roles.findOneBy.mockResolvedValue(null);

    await expect(service.deleteRole(missingRoleId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(provider.deleteRole).not.toHaveBeenCalled();
    expect(roles.delete).not.toHaveBeenCalled();
  });

  it('does not delete locally when provider role deletion fails', async () => {
    roles.findOneBy.mockResolvedValue({
      id: roleId,
      providerId: 'provider-role-id',
    });
    const error = new Error('provider deletion failed');
    provider.deleteRole.mockRejectedValue(error);

    await expect(service.deleteRole(roleId)).rejects.toBe(error);
    expect(roles.delete).not.toHaveBeenCalled();
  });

  it('returns not found if local role deletion affects no rows', async () => {
    roles.findOneBy.mockResolvedValue({
      id: roleId,
      providerId: 'provider-role-id',
    });
    roles.delete.mockResolvedValue({ affected: 0 });

    await expect(service.deleteRole(roleId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
