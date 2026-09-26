import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisDbService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis.Redis,
  ) {}

  // A set function for storing values with their keys in Redis
  async set(key: string, value: any, ex: number) {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ex);
  }

  // Get values using keys from Redis
  async get(key: string) {
    const data = await this.redisClient.get(key);

    if (data === null) {
      return null;
    }

    return JSON.parse(data);
  }

  // Remove a specific key from Redis
  async deleteKey(key: string) {
    this.redisClient.del(key);
  }

  async setWhitoutEx(key: string, value: any) {
    try {
      await this.redisClient.set(key, JSON.stringify(value));
      await this.redisClient.persist(key);
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      await this.redisClient.flushdb();
    } catch (error) {
      throw error;
    }
  }
}
