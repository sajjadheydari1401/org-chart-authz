// Delete one unit and all of its descendants.
export const DELETE_UNIT_SUBTREE_QUERY = `
  WITH RECURSIVE unit_tree AS (
    SELECT id
    FROM units
    WHERE id = $1
    UNION ALL
    SELECT child.id
    FROM units AS child
    INNER JOIN unit_tree AS parent ON parent.id = child.parent_id
  )
  DELETE FROM units
  WHERE id IN (SELECT id FROM unit_tree)
`;
