import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = { find: vi.fn(), findOneBy: vi.fn() };
    service = new UsersService(repository as never, {} as AuthProviderService);
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
});
