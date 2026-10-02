import { NotFoundException } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { COUNT_UNIT_BY_ID_QUERY } from '../queries/count-unit-by-id.query.js';
import { DELETE_UNIT_SUBTREE_QUERY } from '../queries/delete-unit-subtree.query.js';

/**
 * Deletes a unit and every descendant under it.
 *
 * This is implemented with a PostgreSQL recursive CTE so the delete stays
 * database-side, atomic, and efficient even for deep org-unit trees.
 *
 * Example of how the CTE expands the subtree before deletion:
 *
 *   units table:
 *     id | parent_id | name
 *     ----------------------
 *      1 | null      | root
 *      2 | 1         | sales
 *      3 | 2         | north
 *      4 | 2         | south
 *      5 | 1         | support
 *
 *   deleteUnitSubtree(1)
 *
 *   Step 1 (anchor):
 *     unit_tree = [{ id: 1 }]
 *
 *   Step 2 (expand children of 1):
 *     parent.id = 1 -> children = [{ id: 2 }, { id: 5 }]
 *     unit_tree = [{ id: 1 }, { id: 2 }, { id: 5 }]
 *
 *   Step 3 (expand children of 2):
 *     parent.id = 2 -> children = [{ id: 3 }, { id: 4 }]
 *     unit_tree = [{ id: 1 }, { id: 2 }, { id: 5 }, { id: 3 }, { id: 4 }]
 *
 *   Final delete set:
 *     DELETE FROM units WHERE id IN (1, 2, 3, 4, 5)
 *
 * The recursive part is the important part: UNION ALL keeps appending child rows
 * until no more descendants remain.
 */
export async function deleteUnitSubtree(
  dataSource: Pick<DataSource, 'query'>,
  unitId: string,
): Promise<void> {
  const [{ count }] = await dataSource.query(COUNT_UNIT_BY_ID_QUERY, [unitId]);

  if (count === 0) {
    throw new NotFoundException();
  }

  await dataSource.query(DELETE_UNIT_SUBTREE_QUERY, [unitId]);
}
