import { Module } from '@nestjs/common';
import { AuthProviderService } from './auth-provider.service.js';

@Module({
  providers: [AuthProviderService],
  exports: [AuthProviderService],
})
export class AuthProviderModule {}
