// Count a unit before attempting to delete it.
export const COUNT_UNIT_BY_ID_QUERY =
  'SELECT COUNT(*)::int AS count FROM units WHERE id = $1';
