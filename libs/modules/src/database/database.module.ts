import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISecretService } from '@iot-framework/core';
import { ConnectionService } from './connection.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ISecretService],
      useClass: ConnectionService,
    }),
  ],
})
export class DatabaseModule {}
