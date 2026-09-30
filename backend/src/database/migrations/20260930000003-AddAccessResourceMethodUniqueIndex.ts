import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccessResourceMethodUniqueIndex20260930000003 implements MigrationInterface {
  name = 'AddAccessResourceMethodUniqueIndex20260930000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    const duplicates: Array<{
      resource_id: number;
      method_name: string;
      count: number;
    }> = await queryRunner.query(`
      SELECT "resource_id", "method_name", COUNT(*)::int AS "count"
      FROM "accesses"
      GROUP BY "resource_id", "method_name"
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      const pairs = duplicates
        .map(
          ({ resource_id, method_name, count }) =>
            `(${resource_id}, ${method_name}): ${count}`,
        )
        .join(', ');
      throw new Error(
        `Cannot add unique access index; duplicate (resource_id, method_name) pairs found: ${pairs}`,
      );
    }

    await queryRunner.query(
      'CREATE UNIQUE INDEX "UQ_accesses_resource_id_method_name" ON "accesses" ("resource_id", "method_name")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "UQ_accesses_resource_id_method_name"');
  }
}
