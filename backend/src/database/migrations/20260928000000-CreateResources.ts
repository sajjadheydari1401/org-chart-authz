import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResources20260928000000 implements MigrationInterface {
  name = 'CreateResources20260928000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "resources" (
        "id" SERIAL NOT NULL,
        "route" character varying(255) NOT NULL,
        CONSTRAINT "PK_resources_id" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "resources"');
  }
}
