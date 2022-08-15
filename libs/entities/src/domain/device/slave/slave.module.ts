import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from './slave.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slave])],
  exports: [TypeOrmModule],
})
export class SlaveModule {}
