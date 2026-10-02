import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthProviderModule } from './auth-provider.module.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { RolesModule } from '../authorization/roles/roles.module.js';

@Module({
  imports: [AuthProviderModule, UsersModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
