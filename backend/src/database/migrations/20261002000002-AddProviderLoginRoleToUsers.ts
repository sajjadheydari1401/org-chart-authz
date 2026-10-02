import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderLoginRoleToUsers20261002000002 implements MigrationInterface {
  name = 'AddProviderLoginRoleToUsers20261002000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "provider_login_role_id" uuid,
      ADD CONSTRAINT "FK_users_provider_login_role_id"
        FOREIGN KEY ("provider_login_role_id")
        REFERENCES "roles"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT "FK_users_provider_login_role_id",
      DROP COLUMN "provider_login_role_id"
    `);
  }
}
