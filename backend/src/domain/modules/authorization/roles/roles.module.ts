import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '../../units/entities/unit.entity.js';
import { AuthorizationProviderModule } from '../authorization-provider.module.js';
import { Role } from './entities/role.entity.js';
import { RolesController } from './roles.controller.js';
import { RolesService } from './roles.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Unit]),
    AuthorizationProviderModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
