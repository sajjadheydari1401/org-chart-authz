import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFarsiNameToRoles20261001000001 implements MigrationInterface {
  name = 'AddFarsiNameToRoles20261001000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "roles" ADD COLUMN "farsi_name" character varying(255)',
    );
    await queryRunner.query(
      'UPDATE "roles" SET "farsi_name" = "name" WHERE "farsi_name" IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "roles" ALTER COLUMN "farsi_name" SET NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "roles" DROP COLUMN "farsi_name"');
  }
}
