import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnitType } from '../../../types/unit.js';
import { COUNT_UNIT_BY_ID_QUERY } from './queries/count-unit-by-id.query.js';
import { DELETE_UNIT_SUBTREE_QUERY } from './queries/delete-unit-subtree.query.js';
import { UnitsService } from './units.service.js';

describe('UnitsService', () => {
  const unitId = '550e8400-e29b-41d4-a716-446655440008';
  const parentId = '550e8400-e29b-41d4-a716-446655440005';
  const childId = '550e8400-e29b-41d4-a716-446655440009';
  const missingUnitId = '550e8400-e29b-41d4-a716-446655440404';

  let units: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let dataSource: { query: ReturnType<typeof vi.fn> };
  let service: UnitsService;

  beforeEach(() => {
    units = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((unit) => unit),
      save: vi.fn(async (unit) => ({ id: unitId, ...unit })),
      delete: vi.fn(),
    };
    dataSource = { query: vi.fn() };
    service = new UnitsService(units as never, dataSource as never);
  });

  it('returns flat unit records with parent IDs in a stable order', async () => {
    units.find.mockResolvedValue([
      {
        id: unitId,
        name: 'Head Office',
        type: UnitType.MANAGEMENT,
        parent: null,
      },
      {
        id: childId,
        name: 'Sales',
        type: UnitType.DEPARTMENT,
        parent: { id: unitId },
      },
    ]);

    await expect(service.getAllUnits()).resolves.toEqual([
      {
        id: unitId,
        name: 'Head Office',
        type: UnitType.MANAGEMENT,
        parentId: null,
      },
      {
        id: childId,
        name: 'Sales',
        type: UnitType.DEPARTMENT,
        parentId: unitId,
      },
    ]);
    expect(units.find).toHaveBeenCalledExactlyOnceWith({
      select: {
        id: true,
        name: true,
        type: true,
        parent: { id: true },
      },
      relations: { parent: true },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('gets a unit by ID and throws when it does not exist', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    units.findOneBy.mockResolvedValueOnce(unit).mockResolvedValueOnce(null);

    await expect(service.getSingleUnit(unitId)).resolves.toBe(unit);
    expect(units.findOneBy).toHaveBeenNthCalledWith(1, { id: unitId });
    await expect(service.getSingleUnit(missingUnitId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a root unit when no parent is provided', async () => {
    const input = { name: 'Head Office', type: UnitType.MANAGEMENT };
    const expected = { ...input, parent: null };

    await expect(service.createUnit(input)).resolves.toEqual({
      id: unitId,
      ...expected,
    });
    expect(units.findOneBy).not.toHaveBeenCalled();
    expect(units.create).toHaveBeenCalledExactlyOnceWith(expected);
    expect(units.save).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('creates a child unit using its existing parent', async () => {
    const parent = {
      id: parentId,
      name: 'Head Office',
      type: UnitType.MANAGEMENT,
      parent: null,
    };
    const input = { name: 'Team 1', type: UnitType.TEAM, parentId };
    const expected = { name: input.name, type: input.type, parent };
    units.findOneBy.mockResolvedValue(parent);

    await expect(service.createUnit(input)).resolves.toEqual({
      id: unitId,
      ...expected,
    });
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: parentId });
    expect(units.create).toHaveBeenCalledExactlyOnceWith(expected);
    expect(units.save).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('does not create a unit when its requested parent is missing', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(
      service.createUnit({
        name: 'Team 1',
        type: UnitType.TEAM,
        parentId: missingUnitId,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.create).not.toHaveBeenCalled();
    expect(units.save).not.toHaveBeenCalled();
  });

  it('updates only the supplied unit fields', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(
      service.updateUnit(unitId, { name: 'Upper Team' }),
    ).resolves.toEqual({ ...unit, name: 'Upper Team' });
    expect(units.save).toHaveBeenCalledExactlyOnceWith({
      ...unit,
      name: 'Upper Team',
    });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('changes the parent after confirming the new parent exists', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    const parent = {
      id: parentId,
      name: 'Head Office',
      type: UnitType.MANAGEMENT,
      parent: null,
    };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne.mockResolvedValue(parent);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(service.updateUnit(unitId, { parentId })).resolves.toEqual({
      ...unit,
      parent,
    });
    expect(units.findOne).toHaveBeenCalledExactlyOnceWith({
      where: { id: parentId },
      relations: { parent: true },
    });
  });

  it('clears the parent when parentId is null', async () => {
    const unit = {
      id: unitId,
      name: 'Team 1',
      type: UnitType.TEAM,
      parent: { id: parentId },
    };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (updatedUnit) => updatedUnit);

    await expect(
      service.updateUnit(unitId, { parentId: null }),
    ).resolves.toEqual({ ...unit, parent: null });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('moves a unit under an existing parent', async () => {
    const unit = {
      id: unitId,
      name: 'Team 1',
      type: UnitType.TEAM,
      parent: null,
    };
    const parent = {
      id: parentId,
      name: 'Head Office',
      type: UnitType.MANAGEMENT,
      parent: null,
    };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne.mockResolvedValue(parent);
    units.save.mockImplementation(async (movedUnit) => movedUnit);

    await expect(service.moveUnit(unitId, parentId)).resolves.toEqual({
      ...unit,
      parent,
    });
    expect(units.findOneBy).toHaveBeenCalledExactlyOnceWith({ id: unitId });
    expect(units.save).toHaveBeenCalledExactlyOnceWith({ ...unit, parent });
  });

  it('moves a unit to the root when parentId is null', async () => {
    const unit = {
      id: unitId,
      name: 'Team 1',
      type: UnitType.TEAM,
      parent: { id: parentId },
    };
    units.findOneBy.mockResolvedValue(unit);
    units.save.mockImplementation(async (movedUnit) => movedUnit);

    await expect(service.moveUnit(unitId, null)).resolves.toEqual({
      ...unit,
      parent: null,
    });
    expect(units.findOne).not.toHaveBeenCalled();
  });

  it('deletes a unit subtree when the unit exists and is not root', async () => {
    units.findOne.mockResolvedValue({ id: unitId, parent: { id: parentId } });
    dataSource.query
      .mockResolvedValueOnce([{ count: 1 }])
      .mockResolvedValueOnce(undefined);

    await expect(service.deleteUnit(unitId)).resolves.toBeUndefined();
    expect(units.findOne).toHaveBeenCalledExactlyOnceWith({
      where: { id: unitId },
      relations: { parent: true },
    });
    expect(dataSource.query).toHaveBeenNthCalledWith(
      1,
      COUNT_UNIT_BY_ID_QUERY,
      [unitId],
    );
    expect(dataSource.query).toHaveBeenNthCalledWith(
      2,
      DELETE_UNIT_SUBTREE_QUERY,
      [unitId],
    );
  });

  it('throws not found when the unit to delete does not exist', async () => {
    units.findOne.mockResolvedValue(null);

    await expect(service.deleteUnit(missingUnitId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(dataSource.query).not.toHaveBeenCalled();
  });

  it('does not delete a root unit', async () => {
    units.findOne.mockResolvedValue({ id: unitId, parent: null });

    await expect(service.deleteUnit(unitId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(dataSource.query).not.toHaveBeenCalled();
  });

  it('throws not found when the unit to move does not exist', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(
      service.moveUnit(missingUnitId, parentId),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('throws not found when the unit to update does not exist', async () => {
    units.findOneBy.mockResolvedValue(null);

    await expect(
      service.updateUnit(missingUnitId, { name: 'Unknown' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('throws not found when the new parent does not exist', async () => {
    units.findOneBy.mockResolvedValue({
      id: unitId,
      name: 'Team 1',
      type: UnitType.TEAM,
    });
    units.findOne.mockResolvedValue(null);

    await expect(
      service.updateUnit(unitId, { parentId }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('rejects moving a unit under one of its descendants', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne
      .mockResolvedValueOnce({
        id: parentId,
        name: 'Department',
        type: UnitType.DEPARTMENT,
        parent: { id: unitId },
      })
      .mockResolvedValueOnce({
        id: unitId,
        name: 'Team 1',
        type: UnitType.TEAM,
        parent: null,
      });

    await expect(
      service.updateUnit(unitId, { parentId }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(units.save).not.toHaveBeenCalled();
  });

  it('rejects a proposed parent whose ancestor chain already has a cycle', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    units.findOneBy.mockResolvedValue(unit);
    units.findOne
      .mockResolvedValueOnce({
        id: parentId,
        name: 'Department',
        type: UnitType.DEPARTMENT,
        parent: { id: childId },
      })
      .mockResolvedValueOnce({
        id: childId,
        name: 'Team 2',
        type: UnitType.TEAM,
        parent: { id: parentId },
      })
      .mockResolvedValueOnce({
        id: parentId,
        name: 'Department',
        type: UnitType.DEPARTMENT,
        parent: { id: childId },
      });

    await expect(
      service.updateUnit(unitId, { parentId }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(units.save).not.toHaveBeenCalled();
  });
});
