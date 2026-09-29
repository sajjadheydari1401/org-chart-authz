import { describe, expect, it, vi } from 'vitest';
import { AccessesController } from './accesses.controller.js';
import { AccessesService } from './accesses.service.js';

describe('AccessesController', () => {
  it('delegates access deletion with the local ID', async () => {
    const service = { deleteAccess: vi.fn().mockResolvedValue(undefined) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );

    await expect(controller.deleteAccess(9)).resolves.toBeUndefined();
    expect(service.deleteAccess).toHaveBeenCalledExactlyOnceWith(9);
  });

  it('delegates access updates with the local ID and input', async () => {
    const input = { methodName: 'post', description: 'updated' };
    const access = { id: 9, ...input };
    const service = { updateAccess: vi.fn().mockResolvedValue(access) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );
    await expect(controller.updateAccess(9, input)).resolves.toBe(access);
    expect(service.updateAccess).toHaveBeenCalledExactlyOnceWith(9, input);
  });
  it('delegates getAllAccesses to the service', async () => {
    const accesses = [
      {
        id: 1,
        methodName: 'GET',
        description: 'read',
        providerId: 'access-id',
      },
    ];
    const service = { getAllAccesses: vi.fn().mockResolvedValue(accesses) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );

    await expect(controller.getAllAccesses()).resolves.toBe(accesses);
    expect(service.getAllAccesses).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates access creation to the service', async () => {
    const input = {
      resourceId: 7,
      methodName: 'post',
      description: 'description',
    };
    const access = {
      id: 1,
      methodName: 'POST',
      description: input.description,
      providerId: 'provider-id',
      resource: { id: 7 },
    };
    const service = { createAccess: vi.fn().mockResolvedValue(access) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );
    await expect(controller.createAccess(input)).resolves.toBe(access);
    expect(service.createAccess).toHaveBeenCalledExactlyOnceWith(input);
  });
});
