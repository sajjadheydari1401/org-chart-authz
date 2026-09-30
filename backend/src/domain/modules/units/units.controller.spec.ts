import { describe, expect, it, vi } from 'vitest';
import { UnitsController } from './units.controller.js';
import { UnitsService } from './units.service.js';

describe('UnitsController', () => {
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
});
