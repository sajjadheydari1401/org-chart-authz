import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameOrgUnitsToUnits20260926000001
  implements MigrationInterface
{
  name = 'RenameOrgUnitsToUnits20260926000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "org_units" RENAME TO "units"');
    await queryRunner.query(
      'ALTER INDEX "IDX_org_units_parent_id" RENAME TO "IDX_units_parent_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "units" RENAME CONSTRAINT "FK_org_units_parent_id" TO "FK_units_parent_id"',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "units" RENAME CONSTRAINT "FK_units_parent_id" TO "FK_org_units_parent_id"',
    );
    await queryRunner.query(
      'ALTER INDEX "IDX_units_parent_id" RENAME TO "IDX_org_units_parent_id"',
    );
    await queryRunner.query('ALTER TABLE "units" RENAME TO "org_units"');
  }
}