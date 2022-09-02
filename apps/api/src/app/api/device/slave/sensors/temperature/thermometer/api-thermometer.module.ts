import { Module } from '@nestjs/common';
import { ApiThermometerController } from './api-thermometer.controller';
import { ApiThermometerService } from './api-thermometer.service';

@Module({
  controllers: [ApiThermometerController],
  providers: [ApiThermometerService],
})
export class ApiThermometerModule {}
