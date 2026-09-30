import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnitsService } from './units.service.js';

describe('UnitsService', () => {
  let units: {
    findOneBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let service: UnitsService;

  beforeEach(() => {
    units = {
      findOneBy: vi.fn(),
      create: vi.fn((value) => value),
      save: vi.fn(async (unit) => ({ id: 1, ...unit })),
    };
    service = new UnitsService(units as never);
  });

  it('creates a root unit locally when no parent is provided', async () => {
    const input = { name: 'Head Office', type: 'building' };
    const expected = { name: input.name, type: input.type, parent: null };

    await expect(service.createUnit(input)).resolves.toEqual({
      id: 1,
      ...expected,
    });
    expect(units.findOneBy).not.toHaveBeenCalled();
    expect(units.create).toHaveBeenCalledExactlyOnceWith(expected);
    expect(units.save).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('creates a child unit using its local parent relation', async () => {
    const parent = { id: 5, name: 'Head Office', type: 'building' };
    units.findOneBy.mockResolvedValue(parent);
    const input = { name: 'Floor 1', type: 'floor', parentId: 5 };
    const expected = { name: input.name, type: input.type, parent };

    await expect(service.createUnit(input)).resolves.toEqual({
      id: 1,
      ...expected,
    });
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: 5 });
    expect(units.create).toHaveBeenCalledExactlyOnceWith(expected);
    expect(units.save).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('does not create a unit when the requested parent does not exist', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(
      service.createUnit({ name: 'Floor 1', type: 'floor', parentId: 404 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.create).not.toHaveBeenCalled();
    expect(units.save).not.toHaveBeenCalled();
  });
});
