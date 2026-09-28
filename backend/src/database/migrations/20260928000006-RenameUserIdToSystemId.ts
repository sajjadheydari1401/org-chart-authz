import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserIdToSystemId20260928000006 implements MigrationInterface {
  name = 'RenameUserIdToSystemId20260928000006';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" RENAME COLUMN "user_id" TO "system_id"',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" RENAME COLUMN "system_id" TO "user_id"',
    );
  }
}
