import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAccessAccessIdIndex20260930000004 implements MigrationInterface {
  name = 'AddRoleAccessAccessIdIndex20260930000004';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_role_accesses_access_id" ON "role_accesses" ("access_id")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_role_accesses_access_id"');
  }
}
