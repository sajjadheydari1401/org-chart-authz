import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './accesses/entities/access.entity.js';
import { Resource } from './accesses/entities/resource.entity.js';
import { RoleAssignment } from './roles/entities/role-assignment.entity.js';
import { RoleAccess } from './roles/entities/role-access.entity.js';
import { Role } from './roles/entities/role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      Access,
      Role,
      RoleAccess,
      RoleAssignment,
    ]),
  ],
})
export class AuthorizationModule {}
