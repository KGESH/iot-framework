import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Led } from './led.entity';
import { LedQueryRepository } from './led-query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Led])],
  providers: [LedQueryRepository],
  exports: [TypeOrmModule, LedQueryRepository],
})
export class LedModule {}
