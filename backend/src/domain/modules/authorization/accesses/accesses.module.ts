import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity.js';
import { AuthorizationProviderModule } from '../authorization-provider.module.js';
import { ResourcesModule } from '../resources/resources.module.js';
import { AccessesController } from './accesses.controller.js';
import { AccessesService } from './accesses.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Access]),
    ResourcesModule,
    AuthorizationProviderModule,
  ],
  controllers: [AccessesController],
  providers: [AccessesService],
  exports: [AccessesService],
})
export class AccessesModule {}
