import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationProviderService } from './authorization-provider.service.js';
import { Resource } from './accesses/entities/resource.entity.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let provider: { createResource: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = {
      create: vi.fn((input) => input),
      save: vi.fn(async (resource) => ({ id: 1, ...resource })),
    };
    provider = {
      createResource: vi.fn().mockResolvedValue({
        id: 'provider-resource-id',
        route: '/example/v1',
        created_at: '2026-09-28T10:20:23.401Z',
        updated_at: '2026-09-28T10:20:23.401Z',
        deleted_at: null,
      }),
    };
    service = new ResourcesService(
      repository as never,
      provider as unknown as AuthorizationProviderService,
    );
  });

  it('creates the provider resource before saving route and provider ID locally', async () => {
    await expect(
      service.createResource({ route: '/example/v1' }),
    ).resolves.toEqual({
      id: 1,
      route: '/example/v1',
      providerId: 'provider-resource-id',
    });

    expect(provider.createResource).toHaveBeenCalledWith('/example/v1');
    expect(repository.create).toHaveBeenCalledWith({
      route: '/example/v1',
      providerId: 'provider-resource-id',
    });
    expect(repository.save).toHaveBeenCalledOnce();
  });

  it('does not save locally if provider resource creation fails', async () => {
    const providerError = new Error('provider rejected resource');
    provider.createResource.mockRejectedValue(providerError);

    await expect(service.createResource({ route: '/example/v1' })).rejects.toBe(
      providerError,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
