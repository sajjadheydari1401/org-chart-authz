import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  const usersService = {
    getAllUsers: vi.fn(),
    getSingleUser: vi.fn(),
  };
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

  it('delegates getSingleUser with the parsed local ID', async () => {
    const user = { id: 7, username: 'person' };
    usersService.getSingleUser.mockResolvedValue(user);

    await expect(controller.getSingleUser(7)).resolves.toBe(user);
    expect(usersService.getSingleUser).toHaveBeenCalledWith(7);
  });
});
