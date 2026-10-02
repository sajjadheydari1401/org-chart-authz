import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProviderService } from './auth-provider.service.js';
import { AuthService } from './auth.service.js';
import type { ConfirmRegistrationBySmsDto } from './dto/confirm-registration-by-sms.dto.js';
import type { LoginWithUsernamePasswordDto } from './dto/login-with-username-password.dto.js';
import type { RegisterWithUsernamePasswordDto } from './dto/register-with-username-password.dto.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let authProvider: {
    registerWithTwoFactorUsernamePassword: ReturnType<typeof vi.fn>;
    confirmRegistrationBySms: ReturnType<typeof vi.fn>;
    loginWithUsernamePassword: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };
  let usersService: { createLocalUserWithRole: ReturnType<typeof vi.fn> };
  let rolesService: { getRoleByName: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authProvider = {
      registerWithTwoFactorUsernamePassword: vi
        .fn()
        .mockResolvedValue(undefined),
      confirmRegistrationBySms: vi.fn().mockResolvedValue(undefined),
      loginWithUsernamePassword: vi.fn(),
      deleteUser: vi.fn().mockResolvedValue(undefined),
    };
    usersService = {
      createLocalUserWithRole: vi.fn().mockResolvedValue(undefined),
    };
    rolesService = {
      getRoleByName: vi
        .fn()
        .mockResolvedValue({ id: 'role-id', name: 'member' }),
    };
    service = new AuthService(
      authProvider as unknown as AuthProviderService,
      usersService as unknown as UsersService,
      rolesService as never,
    );
  });

  it('registers with the provider, then creates the local user with its role', async () => {
    const input = {
      username: 'person',
      email: 'person@example.test',
      password: 'secret',
      mobile: '09123456789',
      role: 'member',
    } as RegisterWithUsernamePasswordDto;

    await expect(service.registerWithUsernamePassword(input)).resolves.toEqual({
      success: true,
    });
    expect(
      authProvider.registerWithTwoFactorUsernamePassword,
    ).toHaveBeenCalledWith(input);
    expect(rolesService.getRoleByName).toHaveBeenCalledWith('member');
    expect(usersService.createLocalUserWithRole).toHaveBeenCalledWith(
      'person',
      'role-id',
    );
    expect(authProvider.deleteUser).not.toHaveBeenCalled();
  });

  it('does not create a local user if provider registration fails', async () => {
    const providerError = new Error('provider rejected registration');
    authProvider.registerWithTwoFactorUsernamePassword.mockRejectedValue(
      providerError,
    );

    await expect(
      service.registerWithUsernamePassword({
        username: 'person',
      } as RegisterWithUsernamePasswordDto),
    ).rejects.toBe(providerError);
    expect(usersService.createLocalUserWithRole).not.toHaveBeenCalled();
    expect(authProvider.deleteUser).not.toHaveBeenCalled();
  });

  it('deletes the provider user if local user creation fails', async () => {
    const persistenceError = new Error('local database failed');
    usersService.createLocalUserWithRole.mockRejectedValue(persistenceError);

    await expect(
      service.registerWithUsernamePassword({
        username: 'person',
      } as RegisterWithUsernamePasswordDto),
    ).rejects.toBe(persistenceError);
    expect(authProvider.deleteUser).toHaveBeenCalledWith('person');
  });

  it('preserves the local creation error if provider cleanup fails', async () => {
    const persistenceError = new Error('local database failed');
    usersService.createLocalUserWithRole.mockRejectedValue(persistenceError);
    authProvider.deleteUser.mockRejectedValue(
      new Error('provider cleanup failed'),
    );

    await expect(
      service.registerWithUsernamePassword({
        username: 'person',
      } as RegisterWithUsernamePasswordDto),
    ).rejects.toBe(persistenceError);
  });

  it('delegates registration SMS confirmation', async () => {
    const input = {
      username: 'person',
      code: '123456',
    } as ConfirmRegistrationBySmsDto;

    await expect(service.confirmRegistrationBySms(input)).resolves.toEqual({
      success: true,
    });
    expect(authProvider.confirmRegistrationBySms).toHaveBeenCalledWith(input);
  });

  it('returns the provider login result', async () => {
    const input = {
      username: 'person',
      password: 'secret',
    } as LoginWithUsernamePasswordDto;
    const result = { accessToken: 'token', username: 'person' };
    authProvider.loginWithUsernamePassword.mockResolvedValue(result);

    await expect(service.loginWithUsernamePassword(input)).resolves.toEqual(
      result,
    );
    expect(authProvider.loginWithUsernamePassword).toHaveBeenCalledWith(input);
  });
});
