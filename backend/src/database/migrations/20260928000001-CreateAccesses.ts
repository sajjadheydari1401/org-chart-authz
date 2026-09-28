import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccesses20260928000001 implements MigrationInterface {
  name = 'CreateAccesses20260928000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "accesses" (
        "id" SERIAL NOT NULL,
        "resource_id" integer NOT NULL,
        "method_name" character varying(50) NOT NULL,
        "description" text NOT NULL,
        CONSTRAINT "PK_accesses_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_accesses_resource_id"
          FOREIGN KEY ("resource_id")
          REFERENCES "resources"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "accesses"');
  }
}
