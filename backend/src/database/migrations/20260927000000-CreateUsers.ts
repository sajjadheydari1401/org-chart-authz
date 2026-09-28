import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers20260927000000 implements MigrationInterface {
  name = 'CreateUsers20260927000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" character varying(40) NOT NULL,
        "user_id" character varying(255) NOT NULL,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "UQ_users_username" ON "users" ("username")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
  }
}
