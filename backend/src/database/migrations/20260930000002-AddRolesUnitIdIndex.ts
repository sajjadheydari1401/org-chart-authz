import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesUnitIdIndex20260930000002 implements MigrationInterface {
  name = 'AddRolesUnitIdIndex20260930000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_roles_unit_id" ON "roles" ("unit_id")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_roles_unit_id"');
  }
}
