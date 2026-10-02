import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailAndMobileToUsers20261002000001 implements MigrationInterface {
  name = 'AddEmailAndMobileToUsers20261002000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "email" character varying(254),
      ADD COLUMN "mobile" character varying(11)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "mobile",
      DROP COLUMN "email"
    `);
  }
}
