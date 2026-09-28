import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateUsers20260927000000 } from '../database/migrations/20260927000000-CreateUsers.js';
import { CreateResources20260928000000 } from '../database/migrations/20260928000000-CreateResources.js';
import { CreateAccesses20260928000001 } from '../database/migrations/20260928000001-CreateAccesses.js';
import { CreateUnits20260928000002 } from '../database/migrations/20260928000002-CreateUnits.js';
import { CreateRoles20260928000003 } from '../database/migrations/20260928000003-CreateRoles.js';
import { CreateRoleAccesses20260928000004 } from '../database/migrations/20260928000004-CreateRoleAccesses.js';
import { CreateRoleAssignments20260928000005 } from '../database/migrations/20260928000005-CreateRoleAssignments.js';
import { RenameUserIdToSystemId20260928000006 } from '../database/migrations/20260928000006-RenameUserIdToSystemId.js';
import { DropSystemIdFromUsers20260928000007 } from '../database/migrations/20260928000007-DropSystemIdFromUsers.js';
import { AddProviderIdToResources20260928000008 } from '../database/migrations/20260928000008-AddProviderIdToResources.js';
import { Access } from '../domain/modules/authorization/accesses/entities/access.entity.js';
import { Resource } from '../domain/modules/authorization/resources/entities/resource.entity.js';
import { RoleAssignment } from '../domain/modules/authorization/roles/entities/role-assignment.entity.js';
import { RoleAccess } from '../domain/modules/authorization/roles/entities/role-access.entity.js';
import { Role } from '../domain/modules/authorization/roles/entities/role.entity.js';
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
    entities: [User, Resource, Access, Unit, Role, RoleAccess, RoleAssignment],
    migrations: [
      CreateUsers20260927000000,
      CreateResources20260928000000,
      CreateAccesses20260928000001,
      CreateUnits20260928000002,
      CreateRoles20260928000003,
      CreateRoleAccesses20260928000004,
      CreateRoleAssignments20260928000005,
      RenameUserIdToSystemId20260928000006,
      DropSystemIdFromUsers20260928000007,
      AddProviderIdToResources20260928000008,
    ],
    migrationsRun: true,
    synchronize: false,
  };
}
