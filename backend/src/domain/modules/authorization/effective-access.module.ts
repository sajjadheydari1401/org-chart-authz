import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleAssignment } from './role-assignments/entities/role-assignment.entity.js';
import { RoleAccess } from './role-accesses/entities/role-access.entity.js';
import { Role } from './roles/entities/role.entity.js';
import { EffectiveAccessService } from './effective-access.service.js';
import { AccessGuard } from '../../../common/guard/authorization.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([RoleAssignment, Role, RoleAccess])],
  providers: [EffectiveAccessService, AccessGuard],
  exports: [EffectiveAccessService, AccessGuard],
})
export class EffectiveAccessModule {}
