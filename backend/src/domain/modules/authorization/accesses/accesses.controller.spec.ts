import { describe, expect, it, vi } from 'vitest';
import { AccessesController } from './accesses.controller.js';
import { AccessesService } from './accesses.service.js';

describe('AccessesController', () => {
  const accessId = '550e8400-e29b-41d4-a716-446655440001';

  it('delegates access deletion with the local ID', async () => {
    const service = { deleteAccess: vi.fn().mockResolvedValue(undefined) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );

    await expect(controller.deleteAccess(accessId)).resolves.toBeUndefined();
    expect(service.deleteAccess).toHaveBeenCalledExactlyOnceWith(accessId);
  });

  it('delegates access updates with the local ID and input', async () => {
    const input = { methodName: 'post', description: 'updated' };
    const access = { id: accessId, ...input };
    const service = { updateAccess: vi.fn().mockResolvedValue(access) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );
    await expect(controller.updateAccess(accessId, input)).resolves.toBe(
      access,
    );
    expect(service.updateAccess).toHaveBeenCalledExactlyOnceWith(
      accessId,
      input,
    );
  });
  it('delegates getAllAccesses to the service', async () => {
    const accesses = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
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
    const resourceId = '550e8400-e29b-41d4-a716-446655440003';
    const input = {
      resourceId,
      methodName: 'post',
      description: 'description',
    };
    const access = {
      id: '550e8400-e29b-41d4-a716-446655440004',
      methodName: 'POST',
      description: input.description,
      providerId: 'provider-id',
      resource: { id: resourceId },
    };
    const service = { createAccess: vi.fn().mockResolvedValue(access) };
    const controller = new AccessesController(
      service as unknown as AccessesService,
    );
    await expect(controller.createAccess(input)).resolves.toBe(access);
    expect(service.createAccess).toHaveBeenCalledExactlyOnceWith(input);
  });
});
