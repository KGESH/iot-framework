import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Led } from './led.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Led])],
  exports: [TypeOrmModule],
})
export class LedModule {}
