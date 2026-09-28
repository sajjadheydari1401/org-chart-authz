import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: { find: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = { find: vi.fn() };
    service = new UsersService(repository as never, {} as AuthProviderService);
  });

  it('returns users from the local repository', async () => {
    const users = [{ id: 1, username: 'person' } as User];
    repository.find.mockResolvedValue(users);

    await expect(service.getAllUsers()).resolves.toBe(users);
    expect(repository.find).toHaveBeenCalledOnce();
  });
});
