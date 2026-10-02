// Backend-only query used by EffectiveAccessService for roles with DESCENDANTS scope.
// It finds child-unit IDs whose roles' accesses must also be included.
export const GET_DESCENDANT_UNIT_IDS_QUERY = `
  WITH RECURSIVE unit_descendants ("id") AS (
    SELECT "id"
    FROM "units"
    WHERE "id" = ANY($1::uuid[])
    UNION
    SELECT child."id"
    FROM "units" AS child
    INNER JOIN unit_descendants AS parent
      ON child."parent_id" = parent."id"
  )
  SELECT "id"
  FROM unit_descendants
  WHERE NOT ("id" = ANY($1::uuid[]))
`;
