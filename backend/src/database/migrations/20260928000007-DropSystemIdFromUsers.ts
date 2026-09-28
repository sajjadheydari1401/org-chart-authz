import type { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSystemIdFromUsers20260928000007 implements MigrationInterface {
  name = 'DropSystemIdFromUsers20260928000007';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "system_id"');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN "system_id" character varying(255)',
    );
  }
}
