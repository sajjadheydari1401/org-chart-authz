import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let repository: {
    findOneBy: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let provider: {
    createResource: ReturnType<typeof vi.fn>;
    updateResource: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      findOneBy: vi.fn(),
      find: vi.fn(),
      create: vi.fn((input) => input),
      save: vi.fn(async (resource) => ({ id: 1, ...resource })),
    };
    provider = {
      updateResource: vi.fn(),
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

  it('updates the provider first and saves only its returned route locally', async () => {
    const resource = { id: 7, route: '/old', providerId: 'provider-id' };
    repository.findOneBy.mockResolvedValue(resource);
    provider.updateResource.mockImplementation(async () => {
      expect(repository.save).not.toHaveBeenCalled();
      return { id: 'different-id', route: '/updated', updated_at: 'timestamp' };
    });

    await expect(
      service.updateResource(7, { route: '/requested' }),
    ).resolves.toEqual({
      ...resource,
      route: '/updated',
    });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 7 });
    expect(provider.updateResource).toHaveBeenCalledWith(
      'provider-id',
      '/requested',
    );
    expect(repository.save).toHaveBeenCalledExactlyOnceWith({
      ...resource,
      route: '/updated',
    });
    expect(resource.route).toBe('/old');
  });

  it('does not call the provider or save when the local resource is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.updateResource(404, { route: '/updated' }),
    ).rejects.toMatchObject({ status: 404 });
    expect(provider.updateResource).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('keeps the local resource unchanged when the provider update fails', async () => {
    const resource = { id: 7, route: '/old', providerId: 'provider-id' };
    repository.findOneBy.mockResolvedValue(resource);
    const error = new Error('provider rejected update');
    provider.updateResource.mockRejectedValue(error);

    await expect(service.updateResource(7, { route: '/updated' })).rejects.toBe(
      error,
    );
    expect(repository.save).not.toHaveBeenCalled();
    expect(resource.route).toBe('/old');
  });

  it('returns resources from the local repository without calling the provider', async () => {
    const resources = [
      { id: 1, route: '/example/v1', providerId: 'provider-resource-id' },
      { id: 2, route: '/example/v2', providerId: 'another-provider-id' },
    ];
    repository.find.mockResolvedValue(resources);

    await expect(service.getAllResources()).resolves.toBe(resources);
    expect(repository.find).toHaveBeenCalledExactlyOnceWith();
    expect(provider.createResource).not.toHaveBeenCalled();
  });

  it('returns an empty list when there are no local resources', async () => {
    repository.find.mockResolvedValue([]);

    await expect(service.getAllResources()).resolves.toEqual([]);
    expect(provider.createResource).not.toHaveBeenCalled();
  });

  it('propagates local listing failures without calling the provider', async () => {
    const error = new Error('database unavailable');
    repository.find.mockRejectedValue(error);

    await expect(service.getAllResources()).rejects.toBe(error);
    expect(provider.createResource).not.toHaveBeenCalled();
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
