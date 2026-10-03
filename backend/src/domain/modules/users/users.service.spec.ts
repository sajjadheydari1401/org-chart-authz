import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { Role } from '../authorization/roles/entities/role.entity.js';
import { RoleAssignment } from '../authorization/role-assignments/entities/role-assignment.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440001';
  const otherUserId = '550e8400-e29b-41d4-a716-446655440002';
  const unitId = '550e8400-e29b-41d4-a716-446655440003';
  const otherUnitId = '550e8400-e29b-41d4-a716-446655440004';
  const missingUserId = '550e8400-e29b-41d4-a716-446655440404';
  let service: UsersService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let authProvider: { deleteUser: ReturnType<typeof vi.fn> };
  let dataSource: { transaction: ReturnType<typeof vi.fn> };
  let effectiveAccess: {
    getEffectiveAccessesForUsername: ReturnType<typeof vi.fn>;
  };
  let queryBuilder: {
    where: ReturnType<typeof vi.fn>;
    andWhere: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
    addOrderBy: ReturnType<typeof vi.fn>;
    skip: ReturnType<typeof vi.fn>;
    take: ReturnType<typeof vi.fn>;
    getCount: ReturnType<typeof vi.fn>;
    getMany: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: vi.fn(),
    };
    authProvider = { deleteUser: vi.fn().mockResolvedValue(undefined) };
    dataSource = { transaction: vi.fn() };
    queryBuilder = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getCount: vi.fn().mockResolvedValue(1),
      getMany: vi.fn(),
      getOne: vi.fn(),
    };
    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    effectiveAccess = {
      getEffectiveAccessesForUsername: vi.fn().mockResolvedValue([
        { route: '/users', methodName: 'GET', unitIds: [unitId] },
        { route: '/users/:id', methodName: 'GET', unitIds: [unitId] },
        { route: '/users/:id', methodName: 'PATCH', unitIds: [unitId] },
        { route: '/users/:id', methodName: 'DELETE', unitIds: [unitId] },
      ]),
    };
    service = new UsersService(
      repository as never,
      authProvider as unknown as AuthProviderService,
      dataSource as never,
      effectiveAccess as never,
    );
  });

  it('resolves the provider login role from the user', async () => {
    repository.findOne.mockResolvedValue({
      providerLoginRole: { name: 'provider-user' },
      isManager: true,
    });

    await expect(service.getLoginDetails('person')).resolves.toEqual({
      roleName: 'provider-user',
      isManager: true,
    });
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { username: 'person' },
      relations: { providerLoginRole: true },
    });
  });

  it.each([
    null,
    { providerLoginRole: null },
    { providerLoginRole: { name: '  ' } },
  ])(
    'rejects login detail resolution when the user has no provider role',
    async (user) => {
      repository.findOne.mockResolvedValue(user);

      await expect(service.getLoginDetails('person')).rejects.toMatchObject({
        status: 401,
      });
    },
  );

  it("returns a page of users assigned to units within the caller's grant scope", async () => {
    const users = [{ id: userId, username: 'person' } as User];
    queryBuilder.getMany.mockResolvedValue(users);

    await expect(service.getAllUsers('reader')).resolves.toEqual({
      items: users,
      pagination: {
        total: 1,
        current: 1,
        pageSize: 15,
        skip: 0,
        nextPage: null,
      },
    });
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      expect.stringContaining('"assigned_role"."unit_id" IN'),
      { allowedUnitIds: [unitId] },
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith('user.username', 'ASC');
    expect(queryBuilder.skip).toHaveBeenCalledWith(0);
    expect(queryBuilder.take).toHaveBeenCalledWith(15);
  });

  it('applies the requested page and page size', async () => {
    queryBuilder.getCount.mockResolvedValue(13);
    queryBuilder.getMany.mockResolvedValue([]);

    await expect(
      service.getAllUsers('reader', undefined, 2, 5),
    ).resolves.toMatchObject({
      pagination: {
        total: 13,
        current: 2,
        pageSize: 5,
        skip: 5,
        nextPage: 3,
      },
    });
    expect(queryBuilder.skip).toHaveBeenCalledWith(5);
    expect(queryBuilder.take).toHaveBeenCalledWith(5);
  });

  it.each([true, false])(
    'filters users by manager status %s',
    async (isManager) => {
      queryBuilder.getMany.mockResolvedValue([]);

      await service.getAllUsers('reader', undefined, 1, 25, isManager);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'user.isManager = :isManager',
        { isManager },
      );
    },
  );

  it('moves an out-of-range page to the last page', async () => {
    queryBuilder.getCount.mockResolvedValue(13);
    queryBuilder.getMany.mockResolvedValue([]);

    await expect(
      service.getAllUsers('reader', undefined, 99, 5),
    ).resolves.toMatchObject({
      pagination: {
        current: 3,
        pageSize: 5,
        skip: 10,
        nextPage: null,
      },
    });
    expect(queryBuilder.skip).toHaveBeenCalledWith(10);
  });

  it('allows a requested unit only when its read grant is in scope', async () => {
    queryBuilder.getMany.mockResolvedValue([]);

    await expect(
      service.getAllUsers('reader', otherUnitId),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('returns a user by ID when an assigned role places them in scope', async () => {
    const user = { id: userId, username: 'person' } as User;
    queryBuilder.getOne.mockResolvedValue(user);

    await expect(service.getSingleUser(userId, 'reader')).resolves.toBe(user);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id = :userId', {
      userId,
    });
  });

  it("forbids a user outside the caller's unit scope", async () => {
    queryBuilder.getOne.mockResolvedValue(null);
    repository.findOneBy.mockResolvedValue({ id: userId, username: 'person' });

    await expect(
      service.getSingleUser(userId, 'reader'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws not found when the local user ID does not exist', async () => {
    queryBuilder.getOne.mockResolvedValue(null);
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.getSingleUser(missingUserId, 'reader'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a local username', async () => {
    const user = { id: userId, username: 'person' } as User;
    queryBuilder.getOne.mockResolvedValue(user);
    repository.findOneBy.mockResolvedValueOnce(null);
    repository.save.mockImplementation(async (savedUser) => savedUser);

    await expect(
      service.updateUser(
        userId,
        { username: 'renamed' } as UpdateUserDto,
        'reader',
      ),
    ).resolves.toMatchObject({ id: userId, username: 'renamed' });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id = :userId', {
      userId,
    });
    expect(repository.save).toHaveBeenCalledWith({
      id: userId,
      username: 'renamed',
    });
  });

  it("does not update a user outside the caller's unit scope", async () => {
    queryBuilder.getOne.mockResolvedValue(null);
    repository.findOneBy.mockResolvedValue({ id: userId, username: 'person' });

    await expect(
      service.updateUser(
        userId,
        { username: 'renamed' } as UpdateUserDto,
        'reader',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects a username already owned by another local user', async () => {
    repository.findOneBy.mockResolvedValueOnce({
      id: otherUserId,
      username: 'renamed',
    });
    queryBuilder.getOne.mockResolvedValue({ id: userId, username: 'person' });

    await expect(
      service.updateUser(
        userId,
        { username: 'renamed' } as UpdateUserDto,
        'reader',
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('deletes the provider account before deleting the local user', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: userId,
      username: 'person',
    });
    const calls: string[] = [];
    authProvider.deleteUser.mockImplementation(async () => {
      calls.push('provider');
    });
    repository.delete.mockImplementation(async () => {
      calls.push('local');
      return { affected: 1 };
    });

    await expect(service.deleteUser(userId, 'reader')).resolves.toBeUndefined();

    expect(calls).toEqual(['provider', 'local']);
    expect(authProvider.deleteUser).toHaveBeenCalledWith('person');
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id = :userId', {
      userId,
    });
    expect(repository.delete).toHaveBeenCalledWith(userId);
  });

  it("does not delete a user outside the caller's unit scope", async () => {
    queryBuilder.getOne.mockResolvedValue(null);
    repository.findOneBy.mockResolvedValue({ id: userId, username: 'person' });

    await expect(service.deleteUser(userId, 'reader')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(authProvider.deleteUser).not.toHaveBeenCalled();
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('keeps the local user if provider deletion fails', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: userId,
      username: 'person',
    });
    authProvider.deleteUser.mockRejectedValue(
      new Error('provider delete failed'),
    );

    await expect(service.deleteUser(userId, 'reader')).rejects.toThrow(
      'provider delete failed',
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('does not call provider deletion when the local user is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.deleteUser(missingUserId, 'reader'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(authProvider.deleteUser).not.toHaveBeenCalled();
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('creates a local user and role assignment in one transaction', async () => {
    const role = { id: 'role-id', name: 'member' } as Role;
    const user = { id: 'user-id', username: 'person' } as User;
    const transactionUsers = {
      findOneBy: vi.fn().mockResolvedValue(null),
      create: vi.fn((value) => value),
      save: vi.fn().mockResolvedValue(user),
    };
    const transactionRoles = {
      findOneBy: vi.fn().mockResolvedValue(role),
    };
    const transactionAssignments = {
      create: vi.fn((value) => value),
      save: vi.fn().mockResolvedValue({ id: 'assignment-id' }),
    };
    const manager = {
      getRepository: vi.fn((entity: unknown) => {
        if (entity === User) return transactionUsers;
        if (entity === Role) return transactionRoles;
        if (entity === RoleAssignment) return transactionAssignments;
        throw new Error('Unexpected entity repository');
      }),
    };
    dataSource.transaction.mockImplementation(async (callback) =>
      callback(manager),
    );

    await expect(
      service.createLocalUserWithRole({
        username: 'person',
        email: 'person@example.test',
        mobile: '09123456789',
        roleId: 'role-id',
      }),
    ).resolves.toBe(user);

    expect(dataSource.transaction).toHaveBeenCalledOnce();
    expect(transactionUsers.create).toHaveBeenCalledWith({
      username: 'person',
      email: 'person@example.test',
      mobile: '09123456789',
      providerLoginRole: role,
      isManager: false,
    });
    expect(transactionRoles.findOneBy).toHaveBeenCalledWith({ id: 'role-id' });
    expect(transactionAssignments.create).toHaveBeenCalledWith({
      user: { id: user.id },
      role: { id: role.id },
    });
    expect(transactionAssignments.save).toHaveBeenCalledOnce();
  });
});
