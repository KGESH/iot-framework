import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterPump } from './water-pump.entity';
import { WaterPumpQueryRepository } from './water-pump-query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WaterPump])],
  providers: [WaterPumpQueryRepository],
  exports: [TypeOrmModule, WaterPumpQueryRepository],
})
export class WaterPumpModule {}
