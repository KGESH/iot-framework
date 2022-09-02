import { Module } from '@nestjs/common';
import { MasterQueryRepository, SlaveModule } from '@iot-framework/entities';
import { ApiSlaveController } from './api-slave.controller';
import { DeviceSlaveService } from './device-slave.service';
import { ApiSlaveService } from './api-slave.service';
import { DeviceMasterModule } from '../master/device-master.module';
import { SlaveRepository } from './device-slave.repository';
import { DeviceThermometerModule } from './sensors/temperature/thermometer/device-thermometer.module';
import { DeviceWaterPumpModule } from './sensors/water-pump/device-water-pump.module';
import { DeviceLedModule } from './sensors/led/device-led.module';
import { DeviceFanModule } from './sensors/temperature/fan/device-fan.module';

/** Todo: Add Sensors */
@Module({
  imports: [
    SlaveModule,
    DeviceMasterModule,
    DeviceThermometerModule,
    DeviceWaterPumpModule,
    DeviceLedModule,
    DeviceFanModule,
  ],
  controllers: [ApiSlaveController],
  providers: [DeviceSlaveService, ApiSlaveService, SlaveRepository, MasterQueryRepository],
})
export class DeviceSlaveModule {}
