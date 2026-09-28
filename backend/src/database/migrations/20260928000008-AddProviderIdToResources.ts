import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderIdToResources20260928000008 implements MigrationInterface {
  name = 'AddProviderIdToResources20260928000008';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "resources" ADD COLUMN "provider_id" character varying(255) NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "resources" DROP COLUMN "provider_id"',
    );
  }
}
