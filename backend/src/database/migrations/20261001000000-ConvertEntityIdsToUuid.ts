import type { MigrationInterface, QueryRunner } from 'typeorm';

const idTables = [
  'users',
  'resources',
  'units',
  'roles',
  'accesses',
  'role_assignments',
] as const;

const foreignKeys = [
  ['units', 'FK_units_parent_id'],
  ['roles', 'FK_roles_unit_id'],
  ['accesses', 'FK_accesses_resource_id'],
  ['role_accesses', 'FK_role_accesses_role_id'],
  ['role_accesses', 'FK_role_accesses_access_id'],
  ['role_assignments', 'FK_role_assignments_user_id'],
  ['role_assignments', 'FK_role_assignments_role_id'],
] as const;

const primaryKeys = [
  ['users', 'PK_users_id'],
  ['resources', 'PK_resources_id'],
  ['units', 'PK_units_id'],
  ['roles', 'PK_roles_id'],
  ['accesses', 'PK_accesses_id'],
  ['role_accesses', 'PK_role_accesses_role_id_access_id'],
  ['role_assignments', 'PK_role_assignments_id'],
] as const;

const indexes = [
  'IDX_units_parent_id',
  'UQ_role_assignments_user_id_role_id',
  'IDX_role_assignments_role_id',
  'IDX_roles_unit_id',
  'UQ_accesses_resource_id_method_name',
  'IDX_role_accesses_access_id',
] as const;

export class ConvertEntityIdsToUuid20261001000000 implements MigrationInterface {
  name = 'ConvertEntityIdsToUuid20261001000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of idTables) {
      await queryRunner.query(`
        CREATE TEMP TABLE "_uuid_map_${table}" (
          "old_id" integer PRIMARY KEY,
          "new_id" uuid NOT NULL DEFAULT gen_random_uuid()
        )
      `);
      await queryRunner.query(
        `INSERT INTO "_uuid_map_${table}" ("old_id") SELECT "id" FROM "${table}"`,
      );
    }

    await this.dropConstraintsAndIndexes(queryRunner);

    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "id_uuid" uuid;
      ALTER TABLE "resources" ADD COLUMN "id_uuid" uuid;
      ALTER TABLE "units" ADD COLUMN "id_uuid" uuid, ADD COLUMN "parent_id_uuid" uuid;
      ALTER TABLE "roles" ADD COLUMN "id_uuid" uuid, ADD COLUMN "unit_id_uuid" uuid;
      ALTER TABLE "accesses" ADD COLUMN "id_uuid" uuid, ADD COLUMN "resource_id_uuid" uuid;
      ALTER TABLE "role_accesses" ADD COLUMN "role_id_uuid" uuid, ADD COLUMN "access_id_uuid" uuid;
      ALTER TABLE "role_assignments" ADD COLUMN "id_uuid" uuid, ADD COLUMN "user_id_uuid" uuid, ADD COLUMN "role_id_uuid" uuid;
    `);

    await queryRunner.query(`
      UPDATE "users" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_users" AS map WHERE row."id" = map."old_id";
      UPDATE "resources" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_resources" AS map WHERE row."id" = map."old_id";
      UPDATE "units" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_units" AS map WHERE row."id" = map."old_id";
      UPDATE "units" AS row SET "parent_id_uuid" = map."new_id" FROM "_uuid_map_units" AS map WHERE row."parent_id" = map."old_id";
      UPDATE "roles" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_roles" AS map WHERE row."id" = map."old_id";
      UPDATE "roles" AS row SET "unit_id_uuid" = map."new_id" FROM "_uuid_map_units" AS map WHERE row."unit_id" = map."old_id";
      UPDATE "accesses" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_accesses" AS map WHERE row."id" = map."old_id";
      UPDATE "accesses" AS row SET "resource_id_uuid" = map."new_id" FROM "_uuid_map_resources" AS map WHERE row."resource_id" = map."old_id";
      UPDATE "role_accesses" AS row SET "role_id_uuid" = map."new_id" FROM "_uuid_map_roles" AS map WHERE row."role_id" = map."old_id";
      UPDATE "role_accesses" AS row SET "access_id_uuid" = map."new_id" FROM "_uuid_map_accesses" AS map WHERE row."access_id" = map."old_id";
      UPDATE "role_assignments" AS row SET "id_uuid" = map."new_id" FROM "_uuid_map_role_assignments" AS map WHERE row."id" = map."old_id";
      UPDATE "role_assignments" AS row SET "user_id_uuid" = map."new_id" FROM "_uuid_map_users" AS map WHERE row."user_id" = map."old_id";
      UPDATE "role_assignments" AS row SET "role_id_uuid" = map."new_id" FROM "_uuid_map_roles" AS map WHERE row."role_id" = map."old_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "id_uuid" SET NOT NULL;
      ALTER TABLE "resources" ALTER COLUMN "id_uuid" SET NOT NULL;
      ALTER TABLE "units" ALTER COLUMN "id_uuid" SET NOT NULL;
      ALTER TABLE "roles" ALTER COLUMN "id_uuid" SET NOT NULL, ALTER COLUMN "unit_id_uuid" SET NOT NULL;
      ALTER TABLE "accesses" ALTER COLUMN "id_uuid" SET NOT NULL, ALTER COLUMN "resource_id_uuid" SET NOT NULL;
      ALTER TABLE "role_accesses" ALTER COLUMN "role_id_uuid" SET NOT NULL, ALTER COLUMN "access_id_uuid" SET NOT NULL;
      ALTER TABLE "role_assignments" ALTER COLUMN "id_uuid" SET NOT NULL, ALTER COLUMN "user_id_uuid" SET NOT NULL, ALTER COLUMN "role_id_uuid" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "id";
      ALTER TABLE "users" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "resources" DROP COLUMN "id";
      ALTER TABLE "resources" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "units" DROP COLUMN "parent_id", DROP COLUMN "id";
      ALTER TABLE "units" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "units" RENAME COLUMN "parent_id_uuid" TO "parent_id";
      ALTER TABLE "roles" DROP COLUMN "unit_id", DROP COLUMN "id";
      ALTER TABLE "roles" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "roles" RENAME COLUMN "unit_id_uuid" TO "unit_id";
      ALTER TABLE "accesses" DROP COLUMN "resource_id", DROP COLUMN "id";
      ALTER TABLE "accesses" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "accesses" RENAME COLUMN "resource_id_uuid" TO "resource_id";
      ALTER TABLE "role_accesses" DROP COLUMN "role_id", DROP COLUMN "access_id";
      ALTER TABLE "role_accesses" RENAME COLUMN "role_id_uuid" TO "role_id";
      ALTER TABLE "role_accesses" RENAME COLUMN "access_id_uuid" TO "access_id";
      ALTER TABLE "role_assignments" DROP COLUMN "user_id", DROP COLUMN "role_id", DROP COLUMN "id";
      ALTER TABLE "role_assignments" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "role_assignments" RENAME COLUMN "user_id_uuid" TO "user_id";
      ALTER TABLE "role_assignments" RENAME COLUMN "role_id_uuid" TO "role_id";
    `);

    await this.createConstraintsAndIndexes(queryRunner);
    await this.dropMaps(queryRunner, '_uuid_map_');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of idTables) {
      await queryRunner.query(`
        CREATE TEMP TABLE "_int_map_${table}" (
          "old_id" uuid PRIMARY KEY,
          "new_id" integer NOT NULL
        )
      `);
      await queryRunner.query(`
        INSERT INTO "_int_map_${table}" ("old_id", "new_id")
        SELECT "id", ROW_NUMBER() OVER (ORDER BY "id")::integer FROM "${table}"
      `);
    }

    await this.dropConstraintsAndIndexes(queryRunner);

    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "id_int" integer;
      ALTER TABLE "resources" ADD COLUMN "id_int" integer;
      ALTER TABLE "units" ADD COLUMN "id_int" integer, ADD COLUMN "parent_id_int" integer;
      ALTER TABLE "roles" ADD COLUMN "id_int" integer, ADD COLUMN "unit_id_int" integer;
      ALTER TABLE "accesses" ADD COLUMN "id_int" integer, ADD COLUMN "resource_id_int" integer;
      ALTER TABLE "role_accesses" ADD COLUMN "role_id_int" integer, ADD COLUMN "access_id_int" integer;
      ALTER TABLE "role_assignments" ADD COLUMN "id_int" integer, ADD COLUMN "user_id_int" integer, ADD COLUMN "role_id_int" integer;
    `);

    await queryRunner.query(`
      UPDATE "users" AS row SET "id_int" = map."new_id" FROM "_int_map_users" AS map WHERE row."id" = map."old_id";
      UPDATE "resources" AS row SET "id_int" = map."new_id" FROM "_int_map_resources" AS map WHERE row."id" = map."old_id";
      UPDATE "units" AS row SET "id_int" = map."new_id" FROM "_int_map_units" AS map WHERE row."id" = map."old_id";
      UPDATE "units" AS row SET "parent_id_int" = map."new_id" FROM "_int_map_units" AS map WHERE row."parent_id" = map."old_id";
      UPDATE "roles" AS row SET "id_int" = map."new_id" FROM "_int_map_roles" AS map WHERE row."id" = map."old_id";
      UPDATE "roles" AS row SET "unit_id_int" = map."new_id" FROM "_int_map_units" AS map WHERE row."unit_id" = map."old_id";
      UPDATE "accesses" AS row SET "id_int" = map."new_id" FROM "_int_map_accesses" AS map WHERE row."id" = map."old_id";
      UPDATE "accesses" AS row SET "resource_id_int" = map."new_id" FROM "_int_map_resources" AS map WHERE row."resource_id" = map."old_id";
      UPDATE "role_accesses" AS row SET "role_id_int" = map."new_id" FROM "_int_map_roles" AS map WHERE row."role_id" = map."old_id";
      UPDATE "role_accesses" AS row SET "access_id_int" = map."new_id" FROM "_int_map_accesses" AS map WHERE row."access_id" = map."old_id";
      UPDATE "role_assignments" AS row SET "id_int" = map."new_id" FROM "_int_map_role_assignments" AS map WHERE row."id" = map."old_id";
      UPDATE "role_assignments" AS row SET "user_id_int" = map."new_id" FROM "_int_map_users" AS map WHERE row."user_id" = map."old_id";
      UPDATE "role_assignments" AS row SET "role_id_int" = map."new_id" FROM "_int_map_roles" AS map WHERE row."role_id" = map."old_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "id_int" SET NOT NULL;
      ALTER TABLE "resources" ALTER COLUMN "id_int" SET NOT NULL;
      ALTER TABLE "units" ALTER COLUMN "id_int" SET NOT NULL;
      ALTER TABLE "roles" ALTER COLUMN "id_int" SET NOT NULL, ALTER COLUMN "unit_id_int" SET NOT NULL;
      ALTER TABLE "accesses" ALTER COLUMN "id_int" SET NOT NULL, ALTER COLUMN "resource_id_int" SET NOT NULL;
      ALTER TABLE "role_accesses" ALTER COLUMN "role_id_int" SET NOT NULL, ALTER COLUMN "access_id_int" SET NOT NULL;
      ALTER TABLE "role_assignments" ALTER COLUMN "id_int" SET NOT NULL, ALTER COLUMN "user_id_int" SET NOT NULL, ALTER COLUMN "role_id_int" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "id";
      ALTER TABLE "users" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "resources" DROP COLUMN "id";
      ALTER TABLE "resources" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "units" DROP COLUMN "parent_id", DROP COLUMN "id";
      ALTER TABLE "units" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "units" RENAME COLUMN "parent_id_int" TO "parent_id";
      ALTER TABLE "roles" DROP COLUMN "unit_id", DROP COLUMN "id";
      ALTER TABLE "roles" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "roles" RENAME COLUMN "unit_id_int" TO "unit_id";
      ALTER TABLE "accesses" DROP COLUMN "resource_id", DROP COLUMN "id";
      ALTER TABLE "accesses" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "accesses" RENAME COLUMN "resource_id_int" TO "resource_id";
      ALTER TABLE "role_accesses" DROP COLUMN "role_id", DROP COLUMN "access_id";
      ALTER TABLE "role_accesses" RENAME COLUMN "role_id_int" TO "role_id";
      ALTER TABLE "role_accesses" RENAME COLUMN "access_id_int" TO "access_id";
      ALTER TABLE "role_assignments" DROP COLUMN "user_id", DROP COLUMN "role_id", DROP COLUMN "id";
      ALTER TABLE "role_assignments" RENAME COLUMN "id_int" TO "id";
      ALTER TABLE "role_assignments" RENAME COLUMN "user_id_int" TO "user_id";
      ALTER TABLE "role_assignments" RENAME COLUMN "role_id_int" TO "role_id";
    `);

    for (const table of idTables) {
      await queryRunner.query(
        `CREATE SEQUENCE "${table}_id_seq" OWNED BY "${table}"."id"`,
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "id" SET DEFAULT nextval('"${table}_id_seq"')`,
      );
      await queryRunner.query(
        `SELECT setval('"${table}_id_seq"', COALESCE((SELECT MAX("id") FROM "${table}"), 0) + 1, false)`,
      );
    }

    await this.createConstraintsAndIndexes(queryRunner);
    await this.dropMaps(queryRunner, '_int_map_');
  }

  private async dropConstraintsAndIndexes(
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const [table, constraint] of foreignKeys) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${constraint}"`,
      );
    }
    for (const [table, constraint] of primaryKeys) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${constraint}"`,
      );
    }
    for (const index of indexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS "${index}"`);
    }
  }

  private async createConstraintsAndIndexes(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id");
      ALTER TABLE "resources" ADD CONSTRAINT "PK_resources_id" PRIMARY KEY ("id");
      ALTER TABLE "units" ADD CONSTRAINT "PK_units_id" PRIMARY KEY ("id");
      ALTER TABLE "roles" ADD CONSTRAINT "PK_roles_id" PRIMARY KEY ("id");
      ALTER TABLE "accesses" ADD CONSTRAINT "PK_accesses_id" PRIMARY KEY ("id");
      ALTER TABLE "role_accesses" ADD CONSTRAINT "PK_role_accesses_role_id_access_id" PRIMARY KEY ("role_id", "access_id");
      ALTER TABLE "role_assignments" ADD CONSTRAINT "PK_role_assignments_id" PRIMARY KEY ("id");
      ALTER TABLE "units" ADD CONSTRAINT "FK_units_parent_id" FOREIGN KEY ("parent_id") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_unit_id" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "accesses" ADD CONSTRAINT "FK_accesses_resource_id" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "role_accesses" ADD CONSTRAINT "FK_role_accesses_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "role_accesses" ADD CONSTRAINT "FK_role_accesses_access_id" FOREIGN KEY ("access_id") REFERENCES "accesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "role_assignments" ADD CONSTRAINT "FK_role_assignments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      ALTER TABLE "role_assignments" ADD CONSTRAINT "FK_role_assignments_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      CREATE INDEX "IDX_units_parent_id" ON "units" ("parent_id");
      CREATE UNIQUE INDEX "UQ_role_assignments_user_id_role_id" ON "role_assignments" ("user_id", "role_id");
      CREATE INDEX "IDX_role_assignments_role_id" ON "role_assignments" ("role_id");
      CREATE INDEX "IDX_roles_unit_id" ON "roles" ("unit_id");
      CREATE UNIQUE INDEX "UQ_accesses_resource_id_method_name" ON "accesses" ("resource_id", "method_name");
      CREATE INDEX "IDX_role_accesses_access_id" ON "role_accesses" ("access_id");
    `);
  }

  private async dropMaps(
    queryRunner: QueryRunner,
    prefix: '_uuid_map_' | '_int_map_',
  ): Promise<void> {
    for (const table of idTables) {
      await queryRunner.query(`DROP TABLE "${prefix}${table}"`);
    }
  }
}
