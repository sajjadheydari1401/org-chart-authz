import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetRoleScopeModeDefault20260929000001 implements MigrationInterface {
  name = 'SetRoleScopeModeDefault20260929000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "scope_mode" SET DEFAULT 'DESCENDANTS'`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "roles" ALTER COLUMN "scope_mode" DROP DEFAULT',
    );
  }
}
