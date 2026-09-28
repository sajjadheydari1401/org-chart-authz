import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthProviderService } from './auth-provider.service.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthProviderService],
})
export class AuthModule {}
