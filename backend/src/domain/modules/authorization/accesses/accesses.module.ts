import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Access])],
})
export class AccessesModule {}
