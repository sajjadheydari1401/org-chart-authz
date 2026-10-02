// Match users who have an assigned role in one of the allowed units.
export const GET_USERS_IN_UNITS_QUERY = `
  EXISTS (
    SELECT 1
    FROM "role_assignments" "assignment"
    INNER JOIN "roles" "assigned_role"
      ON "assigned_role"."id" = "assignment"."role_id"
    WHERE "assignment"."user_id" = "user"."id"
      AND "assigned_role"."unit_id" IN (:...allowedUnitIds)
  )
`;
