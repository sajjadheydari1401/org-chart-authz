import { NotFoundException } from '@nestjs/common';
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
  const missingUserId = '550e8400-e29b-41d4-a716-446655440404';
  let service: UsersService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let authProvider: { deleteUser: ReturnType<typeof vi.fn> };
  let dataSource: { transaction: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
    };
    authProvider = { deleteUser: vi.fn().mockResolvedValue(undefined) };
    dataSource = { transaction: vi.fn() };
    service = new UsersService(
      repository as never,
      authProvider as unknown as AuthProviderService,
      dataSource as never,
    );
  });

  it('resolves the provider login role from the user', async () => {
    repository.findOne.mockResolvedValue({
      providerLoginRole: { name: 'provider-user' },
    });

    await expect(service.getLoginRoleName('person')).resolves.toBe(
      'provider-user',
    );
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
    'rejects login role resolution when the user has no provider role',
    async (user) => {
      repository.findOne.mockResolvedValue(user);

      await expect(service.getLoginRoleName('person')).rejects.toMatchObject({
        status: 401,
      });
    },
  );

  it('returns users from the local repository', async () => {
    const users = [{ id: userId, username: 'person' } as User];
    repository.find.mockResolvedValue(users);

    await expect(service.getAllUsers()).resolves.toBe(users);
    expect(repository.find).toHaveBeenCalledOnce();
  });

  it('returns a local user by ID', async () => {
    const user = { id: userId, username: 'person' } as User;
    repository.findOneBy.mockResolvedValue(user);

    await expect(service.getSingleUser(userId)).resolves.toBe(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });
  });

  it('throws not found when the local user ID does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.getSingleUser(missingUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a local username', async () => {
    const user = { id: userId, username: 'person' } as User;
    repository.findOneBy
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    repository.save.mockImplementation(async (savedUser) => savedUser);

    await expect(
      service.updateUser(userId, { username: 'renamed' } as UpdateUserDto),
    ).resolves.toMatchObject({ id: userId, username: 'renamed' });
    expect(repository.save).toHaveBeenCalledWith({
      id: userId,
      username: 'renamed',
    });
  });

  it('rejects a username already owned by another local user', async () => {
    repository.findOneBy
      .mockResolvedValueOnce({ id: userId, username: 'person' })
      .mockResolvedValueOnce({ id: otherUserId, username: 'renamed' });

    await expect(
      service.updateUser(userId, { username: 'renamed' } as UpdateUserDto),
    ).rejects.toMatchObject({ status: 409 });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('deletes the provider account before deleting the local user', async () => {
    repository.findOneBy.mockResolvedValue({
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

    await expect(service.deleteUser(userId)).resolves.toBeUndefined();

    expect(calls).toEqual(['provider', 'local']);
    expect(authProvider.deleteUser).toHaveBeenCalledWith('person');
    expect(repository.delete).toHaveBeenCalledWith(userId);
  });

  it('keeps the local user if provider deletion fails', async () => {
    repository.findOneBy.mockResolvedValue({
      id: userId,
      username: 'person',
    });
    authProvider.deleteUser.mockRejectedValue(
      new Error('provider delete failed'),
    );

    await expect(service.deleteUser(userId)).rejects.toThrow(
      'provider delete failed',
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('does not call provider deletion when the local user is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.deleteUser(missingUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
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
    });
    expect(transactionRoles.findOneBy).toHaveBeenCalledWith({ id: 'role-id' });
    expect(transactionAssignments.create).toHaveBeenCalledWith({
      user: { id: user.id },
      role: { id: role.id },
    });
    expect(transactionAssignments.save).toHaveBeenCalledOnce();
  });
});
