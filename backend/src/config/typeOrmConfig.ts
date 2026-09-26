import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateOrgUnits20260926000000 } from '../database/migrations/20260926000000-CreateOrgUnits.js';
import { RenameOrgUnitsToUnits20260926000001 } from '../database/migrations/20260926000001-RenameOrgUnitsToUnits.js';
import { OrgUnit } from '../domain/modules/org-units/entities/org-unit.entity.js';

export function createTypeOrmConfig(
  config: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.getOrThrow<string>('DB_HOST'),
    username: config.getOrThrow<string>('DB_USER'),
    password: config.getOrThrow<string>('DB_PASSWORD'),
    port: Number(config.getOrThrow<string>('DB_PORT')),
    database: config.getOrThrow<string>('DB_NAME'),
    entities: [OrgUnit],
    migrations: [
      CreateOrgUnits20260926000000,
      RenameOrgUnitsToUnits20260926000001,
    ],
    migrationsRun: true,
    synchronize: false,
  };
}
