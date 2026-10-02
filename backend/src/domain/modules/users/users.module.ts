import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProviderModule } from '../auth/auth-provider.module.js';
import { Role } from '../authorization/roles/entities/role.entity.js';
import { RoleAssignment } from '../authorization/role-assignments/entities/role-assignment.entity.js';
import { UsersController } from './users.controller.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { EffectiveAccessModule } from '../authorization/effective-access.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, RoleAssignment]),
    AuthProviderModule,
    EffectiveAccessModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
