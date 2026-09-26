import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisDbService } from './redis.service.js';

@Module({
  providers: [
    {
      // connect to redis
      provide: 'REDIS_CLIENT',
      useValue: new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        db: Number(process.env.REDIS_DB),
      }),
    },
    RedisDbService,
  ],
  exports: [RedisDbService],
})
export class RedisDbModule {}
