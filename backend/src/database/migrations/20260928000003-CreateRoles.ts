import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles20260928000003 implements MigrationInterface {
  name = 'CreateRoles20260928000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "roles_scope_mode_enum" AS ENUM ('SELF', 'DESCENDANTS')`,
    );
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL NOT NULL,
        "unit_id" integer NOT NULL,
        "name" character varying(100) NOT NULL,
        "description" text NOT NULL,
        "scope_mode" "roles_scope_mode_enum" NOT NULL,
        CONSTRAINT "PK_roles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_roles_unit_id"
          FOREIGN KEY ("unit_id")
          REFERENCES "units"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "roles"');
    await queryRunner.query('DROP TYPE "roles_scope_mode_enum"');
  }
}
