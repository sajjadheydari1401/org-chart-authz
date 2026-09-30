import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAssignmentIndexes20260930000001 implements MigrationInterface {
  name = 'AddRoleAssignmentIndexes20260930000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const duplicates: Array<{
      user_id: number;
      role_id: number;
      count: number;
    }> = await queryRunner.query(`
      SELECT "user_id", "role_id", COUNT(*)::int AS "count"
      FROM "role_assignments"
      GROUP BY "user_id", "role_id"
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      const pairs = duplicates
        .map(
          ({ user_id, role_id, count }) => `(${user_id}, ${role_id}): ${count}`,
        )
        .join(', ');
      throw new Error(
        `Cannot add unique role assignment index; duplicate (user_id, role_id) pairs found: ${pairs}`,
      );
    }

    await queryRunner.query(
      'CREATE UNIQUE INDEX "UQ_role_assignments_user_id_role_id" ON "role_assignments" ("user_id", "role_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_role_assignments_role_id" ON "role_assignments" ("role_id")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_role_assignments_role_id"');
    await queryRunner.query('DROP INDEX "UQ_role_assignments_user_id_role_id"');
  }
}
