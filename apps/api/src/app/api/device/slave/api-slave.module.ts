import { Module } from '@nestjs/common';
import { ApiSlaveController } from './api-slave.controller';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveService } from './api-slave.service';
import { ApiMasterService } from '../master/api-master.service';
import { ApiMasterModule } from '../master/api-master.module';
import { ApiThermometerModule } from './sensors/thermometer/api-thermometer.module';
import { ApiWaterPumpModule } from './sensors/water-pump/api-water-pump.module';
import { ApiLedModule } from './sensors/led/api-led.module';

@Module({
  imports: [
    ApiMasterModule,
    SlaveModule,
    ApiThermometerModule,
    ApiWaterPumpModule,
    ApiLedModule,
  ],
  controllers: [ApiSlaveController],
  providers: [ApiMasterService, ApiSlaveService],
  exports: [ApiSlaveService],
})
export class ApiSlaveModule {}
