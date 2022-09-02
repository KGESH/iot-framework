import { Module } from '@nestjs/common';
import { ApiTemperatureController } from './api-temperature.controller';
import { ApiTemperatureService } from './api-temperature.service';

@Module({
  controllers: [ApiTemperatureController],
  providers: [ApiTemperatureService],
})
export class ApiTemperatureModule {}
