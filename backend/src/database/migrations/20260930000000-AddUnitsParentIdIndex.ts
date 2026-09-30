import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnitsParentIdIndex20260930000000 implements MigrationInterface {
  name = 'AddUnitsParentIdIndex20260930000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_units_parent_id" ON "units" ("parent_id")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_units_parent_id"');
  }
}
