import { Module } from '@nestjs/common';
import { AccessesModule } from './accesses/accesses.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { RolesModule } from './roles/roles.module.js';

@Module({
  imports: [RolesModule, ResourcesModule, AccessesModule],
})
export class AuthorizationModule {}
