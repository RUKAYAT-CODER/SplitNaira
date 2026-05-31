import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redis: Redis,
  ) {}

  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness() {
    await this.dataSource.query('SELECT 1');
    await this.redis.ping();

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  async getStartup() {
    return {
      status: 'started',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}