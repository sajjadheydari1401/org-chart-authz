import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { ResourcesController } from './resources.controller.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesController', () => {
  const resourcesService = {
    deleteResource: vi.fn(),
    updateResource: vi.fn(),
    getAllResources: vi.fn(),
    createResource: vi.fn(),
  };
  const controller = new ResourcesController(
    resourcesService as unknown as ResourcesService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const resourceId = '550e8400-e29b-41d4-a716-446655440001';

  it('delegates resource deletion with the local ID', async () => {
    resourcesService.deleteResource.mockResolvedValue(undefined);
    await expect(
      controller.deleteResource(resourceId),
    ).resolves.toBeUndefined();
    expect(resourcesService.deleteResource).toHaveBeenCalledExactlyOnceWith(
      resourceId,
    );
  });

  it('delegates resource updates with the local ID and input', async () => {
    const input = { route: '/updated' };
    const resource = {
      id: resourceId,
      route: input.route,
      providerId: 'provider-id',
    };
    resourcesService.updateResource.mockResolvedValue(resource);

    await expect(controller.updateResource(resourceId, input)).resolves.toBe(
      resource,
    );
    expect(resourcesService.updateResource).toHaveBeenCalledWith(
      resourceId,
      input,
    );
  });

  it('delegates getAllResources to the service', async () => {
    const resources = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        route: '/example/v1',
        providerId: 'provider-id',
      },
    ];
    resourcesService.getAllResources.mockResolvedValue(resources);

    await expect(controller.getAllResources()).resolves.toBe(resources);
    expect(resourcesService.getAllResources).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates resource creation to the local service', async () => {
    const input = { route: '/example/v1' } as CreateResourceDto;
    const resource = {
      id: '550e8400-e29b-41d4-a716-446655440003',
      route: input.route,
      providerId: 'provider-id',
    };
    resourcesService.createResource.mockResolvedValue(resource);

    await expect(controller.createResource(input)).resolves.toBe(resource);
    expect(resourcesService.createResource).toHaveBeenCalledWith(input);
  });
});
