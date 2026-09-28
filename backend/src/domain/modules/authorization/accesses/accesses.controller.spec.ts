import { describe, expect, it, vi } from 'vitest';
import { AccessesController } from './accesses.controller.js';
import { AccessesService } from './accesses.service.js';

describe('AccessesController', () => {
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
