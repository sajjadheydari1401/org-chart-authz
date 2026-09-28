import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessesModule } from './accesses/accesses.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { RoleAssignment } from './roles/entities/role-assignment.entity.js';
import { RoleAccess } from './roles/entities/role-access.entity.js';
import { Role } from './roles/entities/role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleAccess, RoleAssignment]),
    ResourcesModule,
    AccessesModule,
  ],
})
export class AuthorizationModule {}
