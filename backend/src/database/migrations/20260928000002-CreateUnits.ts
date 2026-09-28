import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUnits20260928000002 implements MigrationInterface {
  name = 'CreateUnits20260928000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "units" (
        "id" SERIAL NOT NULL,
        "parent_id" integer,
        "name" character varying(255) NOT NULL,
        "type" character varying(50) NOT NULL,
        CONSTRAINT "PK_units_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_units_parent_id"
          FOREIGN KEY ("parent_id")
          REFERENCES "units"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "units"');
  }
}
