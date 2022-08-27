import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestConnectionService } from './test-connection.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TestConnectionService,
    }),
  ],
})
export class TestDatabaseModule {}
