import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '../accesses/entities/access.entity.js';
import { AuthorizationProviderModule } from '../authorization-provider.module.js';
import { Role } from '../roles/entities/role.entity.js';
import { RoleAccess } from './entities/role-access.entity.js';
import { RoleAccessesController } from './role-accesses.controller.js';
import { RoleAccessesService } from './role-accesses.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleAccess, Role, Access]),
    AuthorizationProviderModule,
  ],
  controllers: [RoleAccessesController],
  providers: [RoleAccessesService],
  exports: [RoleAccessesService],
})
export class RoleAccessesModule {}
