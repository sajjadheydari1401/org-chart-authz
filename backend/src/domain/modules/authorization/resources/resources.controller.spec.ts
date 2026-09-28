import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { ResourcesController } from './resources.controller.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesController', () => {
  const resourcesService = { createResource: vi.fn() };
  const controller = new ResourcesController(
    resourcesService as unknown as ResourcesService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates resource creation to the local service', async () => {
    const input = { route: '/example/v1' } as CreateResourceDto;
    const resource = { id: 1, route: input.route, providerId: 'provider-id' };
    resourcesService.createResource.mockResolvedValue(resource);

    await expect(controller.createResource(input)).resolves.toBe(resource);
    expect(resourcesService.createResource).toHaveBeenCalledWith(input);
  });
});
