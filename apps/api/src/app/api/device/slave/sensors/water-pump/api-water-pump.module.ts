import { Module } from '@nestjs/common';
import { ApiWaterPumpController } from './api-water-pump.controller';
import { ApiWaterPumpService } from './api-water-pump.service';

@Module({
  controllers: [ApiWaterPumpController],
  providers: [ApiWaterPumpService],
})
export class ApiWaterPumpModule {}
