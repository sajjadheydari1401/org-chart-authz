import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleAccesses20260928000004 implements MigrationInterface {
  name = 'CreateRoleAccesses20260928000004';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "role_accesses" (
        "role_id" integer NOT NULL,
        "access_id" integer NOT NULL,
        CONSTRAINT "PK_role_accesses_role_id_access_id"
          PRIMARY KEY ("role_id", "access_id"),
        CONSTRAINT "FK_role_accesses_role_id"
          FOREIGN KEY ("role_id")
          REFERENCES "roles"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "FK_role_accesses_access_id"
          FOREIGN KEY ("access_id")
          REFERENCES "accesses"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "role_accesses"');
  }
}
