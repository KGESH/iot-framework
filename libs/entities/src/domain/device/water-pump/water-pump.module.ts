import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterPump } from './water-pump.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WaterPump])],
  exports: [TypeOrmModule],
})
export class WaterPumpModule {}
