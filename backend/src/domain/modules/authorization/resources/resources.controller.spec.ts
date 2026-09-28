import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { ResourcesController } from './resources.controller.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesController', () => {
  const resourcesService = {
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

  it('delegates resource updates with the local ID and input', async () => {
    const input = { route: '/updated' };
    const resource = { id: 7, route: input.route, providerId: 'provider-id' };
    resourcesService.updateResource.mockResolvedValue(resource);

    await expect(controller.updateResource(7, input)).resolves.toBe(resource);
    expect(resourcesService.updateResource).toHaveBeenCalledWith(7, input);
  });

  it('delegates getAllResources to the service', async () => {
    const resources = [
      { id: 1, route: '/example/v1', providerId: 'provider-id' },
    ];
    resourcesService.getAllResources.mockResolvedValue(resources);

    await expect(controller.getAllResources()).resolves.toBe(resources);
    expect(resourcesService.getAllResources).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates resource creation to the local service', async () => {
    const input = { route: '/example/v1' } as CreateResourceDto;
    const resource = { id: 1, route: input.route, providerId: 'provider-id' };
    resourcesService.createResource.mockResolvedValue(resource);

    await expect(controller.createResource(input)).resolves.toBe(resource);
    expect(resourcesService.createResource).toHaveBeenCalledWith(input);
  });
});
