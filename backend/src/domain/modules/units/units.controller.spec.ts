import { describe, expect, it, vi } from 'vitest';
import { UnitsController } from './units.controller.js';
import { UnitsService } from './units.service.js';

describe('UnitsController', () => {
  it('delegates listing units to the service', async () => {
    const units = [{ id: 1, name: 'Head Office', type: 'building' }];
    const unitsService = { getAllUnits: vi.fn().mockResolvedValue(units) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.getAllUnits()).resolves.toBe(units);
    expect(unitsService.getAllUnits).toHaveBeenCalledExactlyOnceWith();
  });

  it('delegates getting a single unit by id to the service', async () => {
    const unit = { id: 8, name: 'Floor 1', type: 'floor' };
    const unitsService = { getSingleUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.getSingleUnit(8)).resolves.toBe(unit);
    expect(unitsService.getSingleUnit).toHaveBeenCalledExactlyOnceWith(8);
  });

  it('delegates unit creation to the local service', async () => {
    const input = { name: 'Head Office', type: 'building' };
    const unit = { id: 1, ...input, parent: null };
    const unitsService = { createUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.createUnit(input)).resolves.toBe(unit);
    expect(unitsService.createUnit).toHaveBeenCalledExactlyOnceWith(input);
  });

  it('delegates unit updates with the local ID and partial input', async () => {
    const input = { name: 'Renamed Floor' };
    const unit = { id: 8, name: input.name, type: 'floor' };
    const unitsService = { updateUnit: vi.fn().mockResolvedValue(unit) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.updateUnit(8, input)).resolves.toBe(unit);
    expect(unitsService.updateUnit).toHaveBeenCalledExactlyOnceWith(8, input);
  });

  it('delegates unit deletion with the local ID', async () => {
    const unitsService = { deleteUnit: vi.fn().mockResolvedValue(undefined) };
    const controller = new UnitsController(
      unitsService as unknown as UnitsService,
    );

    await expect(controller.deleteUnit(8)).resolves.toBeUndefined();
    expect(unitsService.deleteUnit).toHaveBeenCalledExactlyOnceWith(8);
  });
});
