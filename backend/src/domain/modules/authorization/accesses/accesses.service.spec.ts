import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { ResourcesService } from '../resources/resources.service.js';
import { AccessesService } from './accesses.service.js';

describe('AccessesService', () => {
  const input = {
    resourceId: 7,
    methodName: 'post',
    description: 'requested description',
  };
  const resource = {
    id: 7,
    route: '/example',
    providerId: 'provider-resource-id',
  };
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let resources: { getSingleResource: ReturnType<typeof vi.fn> };
  let provider: { createAccess: ReturnType<typeof vi.fn> };
  let service: AccessesService;

  beforeEach(() => {
    repository = {
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => ({ id: 1, ...value })),
    };
    resources = { getSingleResource: vi.fn().mockResolvedValue(resource) };
    provider = {
      createAccess: vi.fn().mockResolvedValue({
        id: 'provider-access-id',
        methodName: 'POST',
        description: 'provider description',
      }),
    };
    service = new AccessesService(
      repository as never,
      resources as unknown as ResourcesService,
      provider as unknown as AuthorizationProviderService,
    );
  });

  it('uses the provider resource ID and saves provider values with the local relation after success', async () => {
    provider.createAccess.mockImplementation(async () => {
      await Promise.resolve();
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      return {
        id: 'provider-access-id',
        methodName: 'POST',
        description: 'provider description',
      };
    });
    const saved = {
      methodName: 'POST',
      description: 'provider description',
      providerId: 'provider-access-id',
      resource,
    };
    await expect(service.createAccess(input)).resolves.toEqual({
      id: 1,
      ...saved,
    });
    expect(resources.getSingleResource).toHaveBeenCalledWith(7);
    expect(provider.createAccess).toHaveBeenCalledWith(
      'provider-resource-id',
      'post',
      input.description,
    );
    expect(repository.create).toHaveBeenCalledExactlyOnceWith(saved);
    expect(repository.save).toHaveBeenCalledExactlyOnceWith(saved);
  });

  it('does not insert locally when the provider fails', async () => {
    const error = new Error('provider failure');
    provider.createAccess.mockRejectedValue(error);
    await expect(service.createAccess(input)).rejects.toBe(error);
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('does not call the provider when the local resource is missing', async () => {
    resources.getSingleResource.mockRejectedValue(new NotFoundException());
    await expect(service.createAccess(input)).rejects.toMatchObject({
      status: 404,
    });
    expect(provider.createAccess).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
