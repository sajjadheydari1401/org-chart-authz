import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderIdToAccesses20260928000009 implements MigrationInterface {
  name = 'AddProviderIdToAccesses20260928000009';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "accesses" ADD COLUMN "provider_id" character varying(255) NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "accesses" DROP COLUMN "provider_id"');
  }
}
