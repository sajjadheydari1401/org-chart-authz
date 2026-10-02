import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUnitTypeEnum20261002000000 implements MigrationInterface {
  name = 'SetUnitTypeEnum20261002000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const unsupportedTypes: Array<{ type: string }> = await queryRunner.query(`
      SELECT DISTINCT "type"
      FROM "units"
      WHERE upper(trim("type")) NOT IN (
        'ROOT', 'MANAGEMENT', 'DEPARTMENT', 'TEAM'
      )
    `);

    if (unsupportedTypes.length > 0) {
      const values = unsupportedTypes.map(({ type }) => type).join(', ');
      throw new Error(
        `Cannot convert unit types; unsupported values found: ${values}`,
      );
    }

    await queryRunner.query(
      `CREATE TYPE "units_type_enum" AS ENUM ('MANAGEMENT', 'DEPARTMENT', 'TEAM')`,
    );
    await queryRunner.query(`
      ALTER TABLE "units"
      ALTER COLUMN "type" TYPE "units_type_enum"
      USING (
        CASE upper(trim("type"))
          WHEN 'ROOT' THEN 'MANAGEMENT'
          WHEN 'MANAGEMENT' THEN 'MANAGEMENT'
          WHEN 'DEPARTMENT' THEN 'DEPARTMENT'
          WHEN 'TEAM' THEN 'TEAM'
        END
      )::"units_type_enum"
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "units"
      ALTER COLUMN "type" TYPE character varying(50)
      USING (
        CASE "type"::text
          WHEN 'MANAGEMENT' THEN 'root'
          WHEN 'DEPARTMENT' THEN 'department'
          WHEN 'TEAM' THEN 'team'
        END
      )
    `);
    await queryRunner.query('DROP TYPE "units_type_enum"');
  }
}
