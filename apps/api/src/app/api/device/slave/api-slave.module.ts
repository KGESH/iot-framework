import { Module } from '@nestjs/common';
import { ApiSlaveController } from './api-slave.controller';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveService } from './api-slave.service';
import { ApiMasterService } from '../master/api-master.service';
import { ApiMasterModule } from '../master/api-master.module';
import { ApiThermometerModule } from './sensors/thermometer/api-thermometer.module';
import { ApiWaterPumpModule } from './sensors/water-pump/api-water-pump.module';
import { ApiLedModule } from './sensors/led/api-led.module';
import { ApiSensorPowerController } from './sensors/api-sensor-power.controller';
import { ApiSensorPowerService } from './sensors/api-sensor-power.service';

@Module({
  imports: [ApiMasterModule, SlaveModule, ApiThermometerModule, ApiWaterPumpModule, ApiLedModule],
  controllers: [ApiSlaveController, ApiSensorPowerController],
  providers: [ApiMasterService, ApiSlaveService, ApiSensorPowerService],
  exports: [ApiSlaveService],
})
export class ApiSlaveModule {}
