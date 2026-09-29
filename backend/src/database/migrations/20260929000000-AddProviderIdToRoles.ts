import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderIdToRoles20260929000000 implements MigrationInterface {
  name = 'AddProviderIdToRoles20260929000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "roles" ADD COLUMN "provider_id" character varying(255) NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "roles" DROP COLUMN "provider_id"');
  }
}
