import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnitsService } from './units.service.js';

describe('UnitsService', () => {
  let units: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let service: UnitsService;

  beforeEach(() => {
    units = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((value) => value),
      save: vi.fn(async (unit) => ({ id: 1, ...unit })),
    };
    service = new UnitsService(units as never);
  });

  it('lists all units from the local repository', async () => {
    const localUnits = [{ id: 1, name: 'Head Office', type: 'building' }];
    units.find.mockResolvedValue(localUnits);

    await expect(service.getAllUnits()).resolves.toBe(localUnits);
    expect(units.find).toHaveBeenCalledExactlyOnceWith();
  });

  it('gets a single unit by local ID and throws when it does not exist', async () => {
    const localUnit = { id: 8, name: 'Floor 1', type: 'floor' };
    units.findOneBy.mockResolvedValue(localUnit);

    await expect(service.getSingleUnit(8)).resolves.toBe(localUnit);
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: 8 });

    units.findOneBy.mockResolvedValue(null);
    await expect(service.getSingleUnit(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
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
    const parent = {
      id: 5,
      name: 'Head Office',
      type: 'building',
      parent: null,
    };
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

  it('updates only the supplied scalar fields', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor' };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(
      service.updateUnit(8, { name: 'Upper Floor' }),
    ).resolves.toEqual({ ...unit, name: 'Upper Floor' });
    expect(units.save).toHaveBeenCalledExactlyOnceWith({
      ...unit,
      name: 'Upper Floor',
    });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('changes the parent after verifying the new parent exists', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor' };
    const parent = {
      id: 5,
      name: 'Head Office',
      type: 'building',
      parent: null,
    };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne.mockResolvedValue(parent);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(service.updateUnit(8, { parentId: 5 })).resolves.toEqual({
      ...unit,
      parent,
    });
    expect(units.findOne).toHaveBeenCalledExactlyOnceWith({
      where: { id: 5 },
      relations: { parent: true },
    });
  });

  it('clears the parent when parentId is null', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor', parent: { id: 5 } };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(service.updateUnit(8, { parentId: null })).resolves.toEqual({
      ...unit,
      parent: null,
    });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('moves a unit to a new parent and saves it', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor', parent: null };
    const parent = {
      id: 5,
      name: 'Head Office',
      type: 'building',
      parent: null,
    };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne.mockResolvedValue(parent);
    units.save.mockImplementation(async (movedUnit) => movedUnit);

    await expect(service.moveUnit(8, 5)).resolves.toEqual({ ...unit, parent });
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: 8 });
    expect(units.save).toHaveBeenCalledExactlyOnceWith({ ...unit, parent });
  });

  it('moves a unit to the root when parentId is null', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor', parent: { id: 5 } };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (movedUnit) => movedUnit);

    await expect(service.moveUnit(8, null)).resolves.toEqual({
      ...unit,
      parent: null,
    });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('throws not found when the unit to move does not exist', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(service.moveUnit(404, 5)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(units.save).not.toHaveBeenCalled();
  });

  it('throws not found when the unit to update does not exist', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(
      service.updateUnit(404, { name: 'Unknown' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('throws not found when the new parent does not exist', async () => {
    units.findOneBy.mockResolvedValue({
      id: 8,
      name: 'Floor 1',
      type: 'floor',
    });
    units.findOne.mockResolvedValue(null);

    await expect(
      service.updateUnit(8, { parentId: 404 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('rejects a parent change that would create a hierarchy cycle', async () => {
    units.findOneBy.mockResolvedValue({
      id: 8,
      name: 'Floor 1',
      type: 'floor',
    });
    units.findOne
      .mockResolvedValueOnce({
        id: 9,
        name: 'Child',
        type: 'floor',
        parent: { id: 8 },
      })
      .mockResolvedValueOnce({ id: 8, name: 'Floor 1', type: 'floor' });

    await expect(service.updateUnit(8, { parentId: 9 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(units.save).not.toHaveBeenCalled();
  });

  it('rejects a proposed parent with an already-cyclic ancestor chain', async () => {
    units.findOneBy.mockResolvedValue({
      id: 8,
      name: 'Floor 1',
      type: 'floor',
    });
    units.findOne
      .mockResolvedValueOnce({
        id: 9,
        name: 'Child',
        type: 'floor',
        parent: { id: 10 },
      })
      .mockResolvedValueOnce({
        id: 10,
        name: 'Other',
        type: 'floor',
        parent: { id: 9 },
      })
      .mockResolvedValueOnce({
        id: 9,
        name: 'Child',
        type: 'floor',
        parent: { id: 10 },
      });

    await expect(service.updateUnit(8, { parentId: 9 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(units.save).not.toHaveBeenCalled();
  });
});
