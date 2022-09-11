import { Module } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { TestConnectionService } from './test-connection.service';
import { TestDatabaseConfigs } from './types';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TestConnectionService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
