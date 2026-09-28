import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleAssignments20260928000005 implements MigrationInterface {
  name = 'CreateRoleAssignments20260928000005';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "role_assignments" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "role_id" integer NOT NULL,
        CONSTRAINT "PK_role_assignments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_role_assignments_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "users"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "FK_role_assignments_role_id"
          FOREIGN KEY ("role_id")
          REFERENCES "roles"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "role_assignments"');
  }
}
