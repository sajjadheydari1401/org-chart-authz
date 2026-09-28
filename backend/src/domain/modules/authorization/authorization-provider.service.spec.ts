import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderError } from '../../../common/filter/provider-error.js';
import { AppApi } from '../../../common/utils/api/AppApi.js';
import { AuthorizationProviderService } from './authorization-provider.service.js';

vi.mock('../../../common/utils/api/AppApi.js', () => ({
  AppApi: { post: vi.fn() },
}));

const providerPost = vi.mocked(AppApi.post);
const PROVIDER_BASE_URL = 'https://auth.example.test/api/v1';
const ADD_RESOURCE_URL = `${PROVIDER_BASE_URL}/admin/addResource`;
const configuration: Record<string, string> = {
  AUTH_BASE_URL: PROVIDER_BASE_URL,
  AUTH_SYSTEM_USERNAME: 'system-user',
  AUTH_SYSTEM_PASSWORD: 'system-password',
};

describe('AuthorizationProviderService', () => {
  let service: AuthorizationProviderService;

  beforeEach(() => {
    providerPost.mockReset();
    providerPost.mockResolvedValue({
      data: {
        success: true,
        result: {
          route: '/example/v1',
          created_at: '2026-09-28T10:20:23.401Z',
          updated_at: '2026-09-28T10:20:23.401Z',
          id: 'provider-resource-id',
          deleted_at: null,
        },
      },
    } as never);
    service = new AuthorizationProviderService({
      getOrThrow: (key: string) => configuration[key],
    } as ConfigService);
  });

  it('calls addResource with provider credentials and returns the provider result', async () => {
    await expect(service.createResource('/example/v1')).resolves.toMatchObject({
      id: 'provider-resource-id',
      route: '/example/v1',
      deleted_at: null,
    });
    expect(providerPost).toHaveBeenCalledWith(ADD_RESOURCE_URL, {
      systemUsername: 'system-user',
      systemPassword: 'system-password',
      route: '/example/v1',
    });
  });

  it('throws ProviderError when the provider rejects the operation', async () => {
    providerPost.mockResolvedValueOnce({
      data: { success: false, message: 'rejected' },
    } as never);

    await expect(service.createResource('/example/v1')).rejects.toBeInstanceOf(
      ProviderError,
    );
  });

  it('rejects a successful provider response without a resource ID', async () => {
    providerPost.mockResolvedValueOnce({
      data: { success: true, result: { route: '/example/v1' } },
    } as never);

    await expect(service.createResource('/example/v1')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('rejects non-HTTPS provider URLs before making a request', async () => {
    const insecureService = new AuthorizationProviderService({
      getOrThrow: (key: string) =>
        key === 'AUTH_BASE_URL'
          ? 'http://auth.example.test/api/v1'
          : configuration[key],
    } as ConfigService);

    await expect(
      insecureService.createResource('/example/v1'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(providerPost).not.toHaveBeenCalled();
  });
});
