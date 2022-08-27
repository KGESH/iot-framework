import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { MasterQueryRepository } from './master-query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MasterQueryRepository],
  exports: [TypeOrmModule, MasterQueryRepository],
})
export class MasterModule {}
