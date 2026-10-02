import { Module } from '@nestjs/common';
import { AccessesModule } from './accesses/accesses.module.js';
import { RoleAccessesModule } from './role-accesses/role-accesses.module.js';
import { RoleAssignmentsModule } from './role-assignments/role-assignments.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { RolesModule } from './roles/roles.module.js';
import { EffectiveAccessModule } from './effective-access.module.js';

@Module({
  imports: [
    RolesModule,
    RoleAccessesModule,
    RoleAssignmentsModule,
    ResourcesModule,
    AccessesModule,
    EffectiveAccessModule,
  ],
  exports: [EffectiveAccessModule],
})
export class AuthorizationModule {}
