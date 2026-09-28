import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateUsers20260927000000 } from '../database/migrations/20260927000000-CreateUsers.js';
import { CreateResources20260928000000 } from '../database/migrations/20260928000000-CreateResources.js';
import { CreateAccesses20260928000001 } from '../database/migrations/20260928000001-CreateAccesses.js';
import { CreateUnits20260928000002 } from '../database/migrations/20260928000002-CreateUnits.js';
import { Access } from '../domain/modules/accesses/entities/access.entity.js';
import { Resource } from '../domain/modules/accesses/entities/resource.entity.js';
import { Unit } from '../domain/modules/units/entities/unit.entity.js';
import { User } from '../domain/modules/users/entities/user.entity.js';

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
    entities: [User, Resource, Access, Unit],
    migrations: [
      CreateUsers20260927000000,
      CreateResources20260928000000,
      CreateAccesses20260928000001,
      CreateUnits20260928000002,
    ],
    migrationsRun: true,
    synchronize: false,
  };
}
