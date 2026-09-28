import { Module } from '@nestjs/common';
import { AuthorizationProviderService } from './authorization-provider.service.js';

@Module({
  providers: [AuthorizationProviderService],
  exports: [AuthorizationProviderService],
})
export class AuthorizationProviderModule {}
