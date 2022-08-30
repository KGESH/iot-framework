import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slave } from './slave.entity';

import { SlaveQueryRepository } from './slave-query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Slave])],
  providers: [SlaveQueryRepository],
  exports: [TypeOrmModule, SlaveQueryRepository],
})
export class SlaveModule {}
