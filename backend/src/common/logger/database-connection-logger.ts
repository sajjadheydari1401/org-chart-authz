import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { appLogger } from './winston-logger-config.js';

@Injectable()
export class DatabaseConnectionLogger implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  onApplicationBootstrap(): void {
    if (this.dataSource.isInitialized) {
      appLogger.info('Database connection established', {
        database: this.dataSource.options.database,
        type: this.dataSource.options.type,
      });
    }
  }
}
