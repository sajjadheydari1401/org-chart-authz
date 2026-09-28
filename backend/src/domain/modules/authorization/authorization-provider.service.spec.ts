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

  it('posts deleteResource with environment credentials and the provider ID', async () => {
    providerPost.mockResolvedValueOnce({
      data: {
        success: true,
        result: {
          id: 'provider-id',
          route: '/updated/v1',
          created_at: '2026-09-28T11:37:58.322Z',
          updated_at: '2026-09-28T12:01:13.022Z',
          deleted_at: '2026-09-28T12:01:13.022Z',
        },
      },
    } as never);
    await expect(
      service.deleteResource('provider-id'),
    ).resolves.toBeUndefined();
    expect(providerPost).toHaveBeenCalledExactlyOnceWith(
      `${PROVIDER_BASE_URL}/admin/deleteResource`,
      {
        username: 'system-user',
        password: 'system-password',
        resourceId: 'provider-id',
      },
    );
  });

  it('propagates provider rejection of deletion', async () => {
    providerPost.mockResolvedValueOnce({
      data: { success: false, message: 'rejected' },
    } as never);
    await expect(service.deleteResource('provider-id')).rejects.toBeInstanceOf(
      ProviderError,
    );
  });

  it.each([undefined, {}, { success: 'true' }])(
    'rejects invalid deletion success response %j',
    async (data) => {
      providerPost.mockResolvedValueOnce({ data } as never);
      await expect(
        service.deleteResource('provider-id'),
      ).rejects.toBeInstanceOf(BadGatewayException);
    },
  );

  it('propagates deletion transport failures', async () => {
    const error = new Error('connection failed');
    providerPost.mockRejectedValueOnce(error);
    await expect(service.deleteResource('provider-id')).rejects.toBe(error);
  });

  it('rejects non-HTTPS deletion URLs before making a request', async () => {
    const insecureService = new AuthorizationProviderService({
      getOrThrow: (key: string) =>
        key === 'AUTH_BASE_URL'
          ? 'http://auth.example.test/api/v1'
          : configuration[key],
    } as ConfigService);
    await expect(
      insecureService.deleteResource('provider-id'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(providerPost).not.toHaveBeenCalled();
  });

  it('posts updateResource with environment credentials and the provider resource ID', async () => {
    await expect(
      service.updateResource('provider-resource-id', '/example/v1'),
    ).resolves.toMatchObject({
      route: '/example/v1',
    });
    expect(providerPost).toHaveBeenCalledExactlyOnceWith(
      `${PROVIDER_BASE_URL}/admin/updateResource`,
      {
        username: 'system-user',
        password: 'system-password',
        resourceId: 'provider-resource-id',
        route: '/example/v1',
      },
    );
  });

  it('propagates provider rejection of an update', async () => {
    providerPost.mockResolvedValueOnce({
      data: { success: false, message: 'rejected' },
    } as never);
    await expect(
      service.updateResource('provider-id', '/updated'),
    ).rejects.toBeInstanceOf(ProviderError);
  });

  it.each([
    undefined,
    {},
    { success: true },
    { success: true, result: {} },
    { success: true, result: { route: ' ' } },
  ])('rejects malformed update response %j', async (data) => {
    providerPost.mockResolvedValueOnce({ data } as never);
    await expect(
      service.updateResource('provider-id', '/updated'),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('propagates update transport failures', async () => {
    const error = new Error('connection failed');
    providerPost.mockRejectedValueOnce(error);
    await expect(
      service.updateResource('provider-id', '/updated'),
    ).rejects.toBe(error);
  });

  it('rejects non-HTTPS update URLs before making a request', async () => {
    const insecureService = new AuthorizationProviderService({
      getOrThrow: (key: string) =>
        key === 'AUTH_BASE_URL'
          ? 'http://auth.example.test/api/v1'
          : configuration[key],
    } as ConfigService);
    await expect(
      insecureService.updateResource('provider-id', '/updated'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(providerPost).not.toHaveBeenCalled();
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
