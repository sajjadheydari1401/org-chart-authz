import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  const usersService = { getAllUsers: vi.fn() };
  const controller = new UsersController(
    usersService as unknown as UsersService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates getAllUsers to the service', async () => {
    const users = [{ id: 1, username: 'person' }];
    usersService.getAllUsers.mockResolvedValue(users);

    await expect(controller.getAllUsers()).resolves.toBe(users);
    expect(usersService.getAllUsers).toHaveBeenCalledOnce();
  });
});
