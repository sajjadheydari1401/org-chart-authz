import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderIdToRoleAccesses20260929000002 implements MigrationInterface {
  name = 'AddProviderIdToRoleAccesses20260929000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "role_accesses" ADD COLUMN "provider_id" character varying(255) NOT NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "role_accesses" DROP COLUMN "provider_id"',
    );
  }
}
