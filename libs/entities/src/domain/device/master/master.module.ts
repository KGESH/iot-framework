import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { MasterRepository } from './master.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MasterRepository],
  exports: [TypeOrmModule, MasterRepository],
})
export class MasterModule {}
