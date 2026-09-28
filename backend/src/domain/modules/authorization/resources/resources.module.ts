import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationProviderModule } from '../authorization-provider.module.js';
import { Resource } from './entities/resource.entity.js';
import { ResourcesController } from './resources.controller.js';
import { ResourcesService } from './resources.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), AuthorizationProviderModule],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
