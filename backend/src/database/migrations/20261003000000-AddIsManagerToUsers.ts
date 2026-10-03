import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsManagerToUsers20261003000000 implements MigrationInterface {
  name = 'AddIsManagerToUsers20261003000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "is_manager" boolean NOT NULL DEFAULT false
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "is_manager"
    `);
  }
}
