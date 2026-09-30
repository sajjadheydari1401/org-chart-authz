import { describe, expect, it, vi } from 'vitest';
import { RolesController } from './roles.controller.js';
import { RolesService } from './roles.service.js';
import { RoleScopeMode } from './entities/role.entity.js';

describe('RolesController', () => {
  it('delegates getAllRoles to the local service', async () => {
    const roles = [{ id: 1, name: 'manager' }];
    const service = {
      getAllRoles: vi.fn().mockResolvedValue(roles),
      createRole: vi.fn(),
      updateRole: vi.fn(),
      deleteRole: vi.fn(),
      createRoleAccess: vi.fn(),
    };
    const controller = new RolesController(service as unknown as RolesService);

    await expect(controller.getAllRoles()).resolves.toBe(roles);
    expect(service.getAllRoles).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates role creation to the service', async () => {
    const input = {
      name: 'manager',
      description: 'description',
      unitId: 7,
      scopeMode: RoleScopeMode.DESCENDANTS,
    };
    const role = {
      id: 1,
      name: input.name,
      description: input.description,
      providerId: 'role-id',
    };
    const service = { createRole: vi.fn().mockResolvedValue(role) };
    const controller = new RolesController(service as unknown as RolesService);
    await expect(controller.createRole(input)).resolves.toBe(role);
    expect(service.createRole).toHaveBeenCalledExactlyOnceWith(input);
  });

  it('delegates role updates with the local role ID and input', async () => {
    const id = 12;
    const input = {
      name: 'manager',
      description: 'updated description',
      unitId: 7,
      scopeMode: RoleScopeMode.SELF,
    };
    const role = { id, ...input, providerId: 'provider-role-id' };
    const service = { updateRole: vi.fn().mockResolvedValue(role) };
    const controller = new RolesController(service as unknown as RolesService);

    await expect(controller.updateRole(id, input)).resolves.toBe(role);
    expect(service.updateRole).toHaveBeenCalledExactlyOnceWith(id, input);
  });

  it('delegates role deletion with the local role ID', async () => {
    const id = 12;
    const service = { deleteRole: vi.fn().mockResolvedValue(undefined) };
    const controller = new RolesController(service as unknown as RolesService);

    await expect(controller.deleteRole(id)).resolves.toBeUndefined();
    expect(service.deleteRole).toHaveBeenCalledExactlyOnceWith(id);
  });

  it('delegates role-access creation with both local IDs', async () => {
    const input = { roleId: 12, accessId: 34 };
    const mapping = { id: 'mapping-id', ...input };
    const service = {
      createRoleAccess: vi.fn().mockResolvedValue(mapping),
    };
    const controller = new RolesController(service as unknown as RolesService);

    await expect(controller.createRoleAccess(input)).resolves.toBe(mapping);
    expect(service.createRoleAccess).toHaveBeenCalledExactlyOnceWith(input);
  });
});
