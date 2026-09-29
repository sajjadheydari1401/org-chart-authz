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
    findOneBy: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let resources: { getSingleResource: ReturnType<typeof vi.fn> };
  let provider: {
    createAccess: ReturnType<typeof vi.fn>;
    updateAccess: ReturnType<typeof vi.fn>;
  };
  let service: AccessesService;

  beforeEach(() => {
    repository = {
      findOneBy: vi.fn(),
      find: vi.fn(),
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => ({ id: 1, ...value })),
    };
    resources = { getSingleResource: vi.fn().mockResolvedValue(resource) };
    provider = {
      updateAccess: vi.fn(),
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

  it('saves the method name and description returned by the provider', async () => {
    const access = {
      id: 9,
      providerId: 'access-id',
      methodName: 'GET',
      description: 'old',
    };
    repository.findOneBy.mockResolvedValue(access);
    provider.updateAccess.mockResolvedValue({
      methodName: 'POST',
      description: 'updated',
    });

    const result = await service.updateAccess(9, {
      methodName: 'post',
      description: 'requested',
    });

    expect(provider.updateAccess).toHaveBeenCalledExactlyOnceWith(
      'access-id',
      'post',
      'requested',
    );
    const expected = { ...access, methodName: 'POST', description: 'updated' };
    expect(repository.save).toHaveBeenCalledExactlyOnceWith(expected);
    expect(result).toEqual(expected);
  });

  it('waits for the provider response before saving locally', async () => {
    repository.findOneBy.mockResolvedValue({ id: 9, providerId: 'access-id' });
    provider.updateAccess.mockImplementation(async () => {
      await Promise.resolve();
      expect(repository.save).not.toHaveBeenCalled();
      return { methodName: 'POST', description: 'updated' };
    });

    await service.updateAccess(9, {
      methodName: 'post',
      description: 'updated',
    });

    expect(repository.save).toHaveBeenCalledOnce();
  });

  it('does not update the provider when the access is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.updateAccess(404, input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(provider.updateAccess).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('does not save when the provider update fails', async () => {
    repository.findOneBy.mockResolvedValue({ id: 9, providerId: 'access-id' });
    const error = new Error('provider failed');
    provider.updateAccess.mockRejectedValue(error);
    await expect(service.updateAccess(9, input)).rejects.toBe(error);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('returns accesses from the local repository without calling the provider', async () => {
    const accesses = [
      {
        id: 1,
        methodName: 'POST',
        description: 'create',
        providerId: 'access-1',
      },
      { id: 2, methodName: 'GET', description: 'read', providerId: 'access-2' },
    ];
    repository.find.mockResolvedValue(accesses);

    await expect(service.getAllAccesses()).resolves.toBe(accesses);
    expect(repository.find).toHaveBeenCalledExactlyOnceWith();
    expect(provider.createAccess).not.toHaveBeenCalled();
    expect(resources.getSingleResource).not.toHaveBeenCalled();
  });

  it('returns an empty list when there are no local accesses', async () => {
    repository.find.mockResolvedValue([]);

    await expect(service.getAllAccesses()).resolves.toEqual([]);
    expect(provider.createAccess).not.toHaveBeenCalled();
  });

  it('propagates local listing failures without calling the provider', async () => {
    const error = new Error('database unavailable');
    repository.find.mockRejectedValue(error);

    await expect(service.getAllAccesses()).rejects.toBe(error);
    expect(provider.createAccess).not.toHaveBeenCalled();
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
