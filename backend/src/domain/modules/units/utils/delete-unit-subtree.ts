import { NotFoundException } from '@nestjs/common';
import type { DataSource } from 'typeorm';

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
  unitId: number,
): Promise<void> {
  const [{ count }] = await dataSource.query(
    'SELECT COUNT(*)::int AS count FROM units WHERE id = $1',
    [unitId],
  );

  if (count === 0) {
    throw new NotFoundException();
  }

  await dataSource.query(
    `
      WITH RECURSIVE unit_tree AS (
        -- Anchor: start from the unit we want to remove.
        SELECT id
        FROM units
        WHERE id = $1

        -- UNION ALL keeps expanding the tree by adding each child row to the
        -- current result set until there are no more descendants left.
        UNION ALL

        -- Recursive step: follow every child of the current node until the
        -- whole subtree is collected.
        SELECT child.id
        FROM units AS child
        INNER JOIN unit_tree AS parent ON parent.id = child.parent_id
      )
      DELETE FROM units
      WHERE id IN (SELECT id FROM unit_tree)
    `,
    [unitId],
  );
}
