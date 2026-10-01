import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity.js';

// Finds the proposed parent and checks its ancestors to prevent a hierarchy loop.
export async function getParentWithoutCycle(
  units: Pick<Repository<Unit>, 'findOne'>,
  unitId: string,
  parentId: string,
): Promise<Unit> {
  // Load the proposed parent's parent so the loop can continue up the hierarchy.
  const parent = await units.findOne({
    where: { id: parentId },
    relations: { parent: true },
  });
  if (!parent) throw new NotFoundException();

  const visited = new Set<string>();
  let current: Unit | null = parent;

  while (current) {
    // The proposed parent cannot be the unit itself or one of its descendants.
    if (current.id === unitId || visited.has(current.id)) {
      throw new BadRequestException();
    }
    visited.add(current.id);

    const ancestorId = current.parent?.id;
    // No parent means this is the root, so there are no more ancestors to check.
    if (ancestorId === undefined) break;

    // Load the next ancestor's parent for the following iteration.
    current = await units.findOne({
      where: { id: ancestorId },
      relations: { parent: true },
    });
  }

  return parent;
}
