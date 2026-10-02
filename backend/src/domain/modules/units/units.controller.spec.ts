import { describe, expect, it, vi } from 'vitest';
import { UnitType } from '../../../types/unit.js';
import { UnitsController } from './units.controller.js';
import { UnitsService } from './units.service.js';

describe('UnitsController', () => {
  const unitId = '550e8400-e29b-41d4-a716-446655440008';

  it('delegates listing units to the service', async () => {
    const units = [
      {
        id: 'unit-id',
        name: 'Head Office',
        type: 'MANAGEMENT',
        parentId: null,
      },
    ];
    const unitsService = { getAllUnits: vi.fn().mockResolvedValue(units) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.getAllUnits()).resolves.toBe(units);
    expect(unitsService.getAllUnits).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates getting a single unit by id to the service', async () => {
    const unit = { id: unitId, name: 'Team 1', type: UnitType.TEAM };
    const unitsService = { getSingleUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.getSingleUnit(unitId)).resolves.toBe(unit);
    expect(unitsService.getSingleUnit).toHaveBeenCalledExactlyOnceWith(unitId);
  });

  it('delegates unit creation to the local service', async () => {
    const input = { name: 'Head Office', type: UnitType.MANAGEMENT };
    const unit = { id: unitId, ...input, parent: null };
    const unitsService = { createUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.createUnit(input)).resolves.toBe(unit);
    expect(unitsService.createUnit).toHaveBeenCalledExactlyOnceWith(input);
  });

  it('delegates unit updates with the local ID and partial input', async () => {
    const input = { name: 'Renamed Floor' };
    const unit = { id: unitId, name: input.name, type: UnitType.TEAM };
    const unitsService = { updateUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.updateUnit(unitId, input)).resolves.toBe(unit);
    expect(unitsService.updateUnit).toHaveBeenCalledExactlyOnceWith(
      unitId,
      input,
    );
  });

  it('delegates unit deletion with the local ID', async () => {
    const unitsService = { deleteUnit: vi.fn().mockResolvedValue(undefined) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.deleteUnit(unitId)).resolves.toBeUndefined();
    expect(unitsService.deleteUnit).toHaveBeenCalledExactlyOnceWith(unitId);
  });
});
