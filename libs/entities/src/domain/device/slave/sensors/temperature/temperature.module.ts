import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thermometer } from './thermometer.entity';
import { Temperature } from './temperature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Temperature, Thermometer])],
  exports: [TypeOrmModule],
})
export class TemperatureModule {}
