import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleScopeMode } from './roles/entities/role.entity.js';
import { EffectiveAccessService } from './effective-access.service.js';

describe('EffectiveAccessService', () => {
  const parentUnitId = '550e8400-e29b-41d4-a716-446655440001';
  const childUnitId = '550e8400-e29b-41d4-a716-446655440002';
  let roleAssignments: { find: ReturnType<typeof vi.fn> };
  let roles: { find: ReturnType<typeof vi.fn> };
  let roleAccesses: { find: ReturnType<typeof vi.fn> };
  let accesses: { find: ReturnType<typeof vi.fn> };
  let users: { findOne: ReturnType<typeof vi.fn> };
  let dataSource: { query: ReturnType<typeof vi.fn> };
  let service: EffectiveAccessService;

  beforeEach(() => {
    roleAssignments = { find: vi.fn() };
    roles = { find: vi.fn() };
    roleAccesses = { find: vi.fn() };
    accesses = { find: vi.fn() };
    users = { findOne: vi.fn().mockResolvedValue(null) };
    dataSource = { query: vi.fn() };
    service = new EffectiveAccessService(
      roleAssignments as never,
      roles as never,
      roleAccesses as never,
      accesses as never,
      users as never,
      dataSource as never,
    );
  });

  it('returns no accesses when the user has no assigned roles', async () => {
    roleAssignments.find.mockResolvedValue([]);

    await expect(
      service.getEffectiveAccessesForUsername('person'),
    ).resolves.toEqual([]);
    expect(roles.find).not.toHaveBeenCalled();
    expect(roleAccesses.find).not.toHaveBeenCalled();
  });

  it('returns accesses directly linked to SELF roles', async () => {
    roleAssignments.find.mockResolvedValue([
      {
        role: {
          id: 'role-self',
          unit: { id: parentUnitId },
          scopeMode: RoleScopeMode.SELF,
        },
      },
    ]);
    roleAccesses.find.mockResolvedValue([
      {
        role: { unit: { id: parentUnitId } },
        access: {
          methodName: 'read',
          resource: { route: '/users' },
        },
      },
    ]);

    await expect(
      service.getEffectiveAccessesForUsername('person'),
    ).resolves.toEqual([
      { route: '/users', methodName: 'read', unitIds: [parentUnitId] },
    ]);
    expect(dataSource.query).not.toHaveBeenCalled();
    expect(roleAccesses.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { roleId: expect.anything() },
        relations: { role: { unit: true }, access: { resource: true } },
      }),
    );
  });

  it('adds descendant-role accesses and deduplicates effective accesses', async () => {
    roleAssignments.find.mockResolvedValue([
      {
        role: {
          id: 'role-parent',
          unit: { id: parentUnitId },
          scopeMode: RoleScopeMode.DESCENDANTS,
        },
      },
    ]);
    dataSource.query.mockResolvedValue([{ id: childUnitId }]);
    roles.find.mockResolvedValue([{ id: 'role-child' }]);
    roleAccesses.find.mockResolvedValue([
      {
        role: { unit: { id: parentUnitId } },
        access: {
          methodName: 'read',
          resource: { route: '/users' },
        },
      },
      {
        role: { unit: { id: childUnitId } },
        access: {
          methodName: 'read',
          resource: { route: '/users' },
        },
      },
      {
        role: { unit: { id: childUnitId } },
        access: {
          methodName: 'write',
          resource: { route: '/users' },
        },
      },
    ]);

    await expect(
      service.getEffectiveAccessesForUsername('person'),
    ).resolves.toEqual([
      {
        route: '/users',
        methodName: 'read',
        unitIds: [parentUnitId, childUnitId],
      },
      { route: '/users', methodName: 'write', unitIds: [childUnitId] },
    ]);
    expect(dataSource.query).toHaveBeenCalledOnce();
    expect(roles.find).toHaveBeenCalledWith({
      where: { unit: { id: expect.anything() } },
      select: { id: true },
    });
  });
});
