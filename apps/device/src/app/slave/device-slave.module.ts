import { Module } from '@nestjs/common';
import {
  LedModule,
  MasterQueryRepository,
  SlaveModule,
  TemperatureModule,
  WaterPumpModule,
} from '@iot-framework/entities';
import { ApiSlaveController } from './api-slave.controller';
import { DeviceSlaveService } from './device-slave.service';
import { ApiSlaveService } from './api-slave.service';
import { DeviceMasterModule } from '../master/device-master.module';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { SlaveRepository } from './device-slave.repository';
import { DeviceThermometerModule } from './sensors/thermometer/device-thermometer.module';
import { DeviceWaterPumpModule } from './sensors/water-pump/device-water-pump.module';
import { DeviceLedModule } from './sensors/led/device-led.module';

/** Todo: Add Sensors */
@Module({
  imports: [
    DeviceMasterModule,
    SlaveModule,
    LedModule,
    WaterPumpModule,
    TemperatureModule,
    DeviceThermometerModule,
    DeviceWaterPumpModule,
    DeviceLedModule,
  ],
  controllers: [ApiSlaveController],
  providers: [
    DeviceSlaveService,
    ApiSlaveService,
    SlaveRepository,
    MasterQueryRepository,
    SlaveQueryRepository,
  ],
})
export class DeviceSlaveModule {}
