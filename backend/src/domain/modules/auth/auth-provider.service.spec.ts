import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderError } from '../../../common/filter/provider-error.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';
import { AuthProviderService } from './auth-provider.service.js';

vi.mock('../../../common/utils/api/AppApi.js', () => ({
  AppApi: { post: vi.fn() },
}));

const providerPost = vi.mocked(AppApi.post);
const PROVIDER_BASE_URL = 'https://auth.example.test/api/v1';
const REGISTER_WITH_TWO_FACTOR_URL = `${PROVIDER_BASE_URL}/auth/2FA_register_UP`;
const CONFIRM_REGISTRATION_URL = `${PROVIDER_BASE_URL}/auth/register/confirm`;
const LOGIN_UP_URL = `${PROVIDER_BASE_URL}/auth/login_UP`;
const DELETE_USER_URL = `${PROVIDER_BASE_URL}/user/deleteUser`;
const configuration: Record<string, string> = {
  AUTH_BASE_URL: PROVIDER_BASE_URL,
  AUTH_SYSTEM_USERNAME: 'system-user',
  AUTH_SYSTEM_PASSWORD: 'system-password',
  AUTH_SMS_TEMPLATE: 'sms-template',
  AUTH_PATTERN_NAME: 'register',
  AUTH_SMS_SYSTEM_NAME: 'auth-system',
};

describe('AuthProviderService', () => {
  let service: AuthProviderService;

  beforeEach(() => {
    providerPost.mockReset();
    providerPost.mockResolvedValue({
      data: { success: true },
    } as never);
    const config = {
      getOrThrow: (key: string) => configuration[key],
    } as ConfigService;
    service = new AuthProviderService(config);
  });

  it('sends username-password registration to the provider 2FA endpoint', async () => {
    const input = {
      username: 'person',
      email: 'person@example.test',
      password: 'secret',
      mobile: '09123456789',
      role: 'manager',
    };

    await service.registerWithTwoFactorUsernamePassword(input);

    expect(providerPost).toHaveBeenCalledWith(REGISTER_WITH_TWO_FACTOR_URL, {
      systemUsername: 'system-user',
      systemPassword: 'system-password',
      roleName: input.role,
      smsTemplate: 'sms-template',
      patternName: 'register',
      smsSystemName: 'auth-system',
      email: input.email,
      username: input.username,
      password: input.password,
      mobile_number: input.mobile,
    });
  });

  it('confirms registration with the SMS confirmation endpoint', async () => {
    await service.confirmRegistrationBySms({
      username: 'person',
      code: '123456',
    });

    expect(providerPost).toHaveBeenCalledWith(CONFIRM_REGISTRATION_URL, {
      systemUsername: 'system-user',
      systemPassword: 'system-password',
      username: 'person',
      code: '123456',
    });
  });

  it('returns the provider username without exposing its token', async () => {
    providerPost.mockResolvedValueOnce({
      data: {
        success: true,
        result: {
          username: 'person',
          userId: 'provider-user-id',
          systemId: 'provider-system-id',
          token: 'access-token',
        },
      },
    } as never);

    await expect(
      service.loginWithUsernamePassword(
        {
          username: 'person',
          password: 'secret',
        },
        'manager',
      ),
    ).resolves.toEqual({ username: 'person' });
    expect(providerPost).toHaveBeenCalledWith(LOGIN_UP_URL, {
      systemUsername: 'system-user',
      systemPassword: 'system-password',
      roleName: 'manager',
      username: 'person',
      password: 'secret',
    });
  });

  it('deletes a provider user by username', async () => {
    await service.deleteUser('person');

    expect(providerPost).toHaveBeenCalledWith(DELETE_USER_URL, {
      systemUsername: 'system-user',
      systemPassword: 'system-password',
      username: 'person',
    });
  });

  it('maps unsuccessful provider responses to ProviderError', async () => {
    providerPost.mockResolvedValueOnce({
      data: { success: false, message: 'rejected' },
    } as never);

    await expect(service.deleteUser('person')).rejects.toBeInstanceOf(
      ProviderError,
    );
  });

  it('rejects provider responses without success', async () => {
    providerPost.mockResolvedValueOnce({ data: {} } as never);

    await expect(service.deleteUser('person')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('rejects non-HTTPS provider URLs before making a request', async () => {
    const httpConfig = {
      getOrThrow: (key: string) =>
        key === 'AUTH_BASE_URL'
          ? 'http://auth.example.test'
          : configuration[key],
    } as ConfigService;
    const insecureProvider = new AuthProviderService(httpConfig);

    await expect(insecureProvider.deleteUser('person')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(providerPost).not.toHaveBeenCalled();
  });
});
