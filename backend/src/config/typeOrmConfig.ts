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
import { AddProviderIdToAccesses20260928000009 } from '../database/migrations/20260928000009-AddProviderIdToAccesses.js';
import { AddProviderIdToRoles20260929000000 } from '../database/migrations/20260929000000-AddProviderIdToRoles.js';
import { SetRoleScopeModeDefault20260929000001 } from '../database/migrations/20260929000001-SetRoleScopeModeDefault.js';
import { AddProviderIdToRoleAccesses20260929000002 } from '../database/migrations/20260929000002-AddProviderIdToRoleAccesses.js';
import { AddUnitsParentIdIndex20260930000000 } from '../database/migrations/20260930000000-AddUnitsParentIdIndex.js';
import { AddRoleAssignmentIndexes20260930000001 } from '../database/migrations/20260930000001-AddRoleAssignmentIndexes.js';
import { AddRolesUnitIdIndex20260930000002 } from '../database/migrations/20260930000002-AddRolesUnitIdIndex.js';
import { AddAccessResourceMethodUniqueIndex20260930000003 } from '../database/migrations/20260930000003-AddAccessResourceMethodUniqueIndex.js';
import { AddRoleAccessAccessIdIndex20260930000004 } from '../database/migrations/20260930000004-AddRoleAccessAccessIdIndex.js';
import { ConvertEntityIdsToUuid20261001000000 } from '../database/migrations/20261001000000-ConvertEntityIdsToUuid.js';
import { AddFarsiNameToRoles20261001000001 } from '../database/migrations/20261001000001-AddFarsiNameToRoles.js';
import { SetUnitTypeEnum20261002000000 } from '../database/migrations/20261002000000-SetUnitTypeEnum.js';
import { Access } from '../domain/modules/authorization/accesses/entities/access.entity.js';
import { Resource } from '../domain/modules/authorization/resources/entities/resource.entity.js';
import { RoleAssignment } from '../domain/modules/authorization/role-assignments/entities/role-assignment.entity.js';
import { RoleAccess } from '../domain/modules/authorization/role-accesses/entities/role-access.entity.js';
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
      AddProviderIdToAccesses20260928000009,
      AddProviderIdToRoles20260929000000,
      SetRoleScopeModeDefault20260929000001,
      AddProviderIdToRoleAccesses20260929000002,
      AddUnitsParentIdIndex20260930000000,
      AddRoleAssignmentIndexes20260930000001,
      AddRolesUnitIdIndex20260930000002,
      AddAccessResourceMethodUniqueIndex20260930000003,
      AddRoleAccessAccessIdIndex20260930000004,
      ConvertEntityIdsToUuid20261001000000,
      AddFarsiNameToRoles20261001000001,
      SetUnitTypeEnum20261002000000,
    ],
    migrationsRun: true,
    synchronize: false,
  };
}
