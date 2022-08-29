import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ISecretService } from '@iot-framework/core';

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
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    } as TypeOrmModuleOptions;
  }
}
