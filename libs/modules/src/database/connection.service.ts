import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ISecretService } from '@iot-framework/core';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class ConnectionService implements TypeOrmOptionsFactory {
  constructor(private readonly secretService: ISecretService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.secretService.DATABASE_TYPE,
      host: this.secretService.DATABASE_HOST,
      database: this.secretService.DATABASE_NAME,
      username: this.secretService.DATABASE_USER,
      password: this.secretService.DATABASE_PASSWORD,
      port: +this.secretService.DATABASE_PORT,

      entities: [],
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
      logging: true,
    } as TypeOrmModuleOptions;
  }
}
