import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateUsers20260927000000 } from '../database/migrations/20260927000000-CreateUsers.js';
import { CreateResources20260928000000 } from '../database/migrations/20260928000000-CreateResources.js';
import { Resource } from '../domain/modules/accesses/entities/resource.entity.js';
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
    entities: [User, Resource],
    migrations: [CreateUsers20260927000000, CreateResources20260928000000],
    migrationsRun: true,
    synchronize: false,
  };
}
