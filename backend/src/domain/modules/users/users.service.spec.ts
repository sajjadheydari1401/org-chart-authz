import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let authProvider: { deleteUser: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
    };
    authProvider = { deleteUser: vi.fn().mockResolvedValue(undefined) };
    service = new UsersService(
      repository as never,
      authProvider as unknown as AuthProviderService,
    );
  });

  it('returns users from the local repository', async () => {
    const users = [{ id: 1, username: 'person' } as User];
    repository.find.mockResolvedValue(users);

    await expect(service.getAllUsers()).resolves.toBe(users);
    expect(repository.find).toHaveBeenCalledOnce();
  });

  it('returns a local user by ID', async () => {
    const user = { id: 7, username: 'person' } as User;
    repository.findOneBy.mockResolvedValue(user);

    await expect(service.getSingleUser(7)).resolves.toBe(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });

  it('throws not found when the local user ID does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.getSingleUser(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a local username', async () => {
    const user = { id: 7, username: 'person' } as User;
    repository.findOneBy
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    repository.save.mockImplementation(async (savedUser) => savedUser);

    await expect(
      service.updateUser(7, { username: 'renamed' } as UpdateUserDto),
    ).resolves.toMatchObject({ id: 7, username: 'renamed' });
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('rejects a username already owned by another local user', async () => {
    repository.findOneBy
      .mockResolvedValueOnce({ id: 7, username: 'person' })
      .mockResolvedValueOnce({ id: 8, username: 'renamed' });

    await expect(
      service.updateUser(7, { username: 'renamed' } as UpdateUserDto),
    ).rejects.toMatchObject({ status: 409 });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('deletes the provider account before deleting the local user', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 7,
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

    await expect(service.deleteUser(7)).resolves.toBeUndefined();

    expect(calls).toEqual(['provider', 'local']);
    expect(authProvider.deleteUser).toHaveBeenCalledWith('person');
    expect(repository.delete).toHaveBeenCalledWith(7);
  });

  it('keeps the local user if provider deletion fails', async () => {
    repository.findOneBy.mockResolvedValue({
      id: 7,
      username: 'person',
    });
    authProvider.deleteUser.mockRejectedValue(
      new Error('provider delete failed'),
    );

    await expect(service.deleteUser(7)).rejects.toThrow(
      'provider delete failed',
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('does not call provider deletion when the local user is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.deleteUser(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(authProvider.deleteUser).not.toHaveBeenCalled();
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
