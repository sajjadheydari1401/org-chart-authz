import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisDbService } from './redis.service.js';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: Number(config.get<string>('REDIS_PORT') ?? 6379),
          db: Number(config.get<string>('REDIS_DB') ?? 0),
        }),
    },
    RedisDbService,
  ],
  exports: [RedisDbService],
})
export class RedisDbModule {}
