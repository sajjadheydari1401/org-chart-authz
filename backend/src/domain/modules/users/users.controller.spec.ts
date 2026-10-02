import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440001';
  const unitId = '550e8400-e29b-41d4-a716-446655440003';
  const usersService = {
    getAllUsers: vi.fn(),
    getSingleUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  };
  const controller = new UsersController(
    usersService as unknown as UsersService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates getAllUsers to the service', async () => {
    const users = [{ id: userId, username: 'person' }];
    usersService.getAllUsers.mockResolvedValue(users);

    await expect(
      controller.getAllUsers({ user: { username: 'reader' } } as never, {
        unitId,
      }),
    ).resolves.toBe(users);
    expect(usersService.getAllUsers).toHaveBeenCalledWith('reader', unitId);
  });

  it('delegates getSingleUser with the parsed local ID', async () => {
    const user = { id: userId, username: 'person' };
    usersService.getSingleUser.mockResolvedValue(user);

    await expect(
      controller.getSingleUser(userId, {
        user: { username: 'reader' },
      } as never),
    ).resolves.toBe(user);
    expect(usersService.getSingleUser).toHaveBeenCalledWith(userId, 'reader');
  });

  it('delegates username updates with the local ID and input', async () => {
    const input = { username: 'renamed' };
    const user = { id: userId, username: 'renamed' };
    usersService.updateUser.mockResolvedValue(user);

    await expect(controller.updateUser(userId, input)).resolves.toBe(user);
    expect(usersService.updateUser).toHaveBeenCalledWith(userId, input);
  });

  it('delegates local user deletion with the parsed ID', async () => {
    usersService.deleteUser.mockResolvedValue(undefined);

    await expect(controller.deleteUser(userId)).resolves.toBeUndefined();
    expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
  });
});
