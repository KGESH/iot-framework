import { Module } from '@nestjs/common';
import {
  SlaveModule,
  TemperatureModule,
  TemperatureQueryRepository,
  ThermometerQueryRepository,
} from '@iot-framework/entities';
import { ApiThermometerController } from './api-thermometer.controller';
import { DeviceThermometerService } from './device-thermometer.service';
import { ThermometerRepository } from './thermometer.repository';
import { MqttBrokerModule } from '../../../../mqtt/mqtt.module';
import { DeviceTemperatureController } from '../device-temperature.controller';
import { TemperatureRepository } from '../temperature.repository';
import { DeviceFanService } from '../fan/device-fan.service';
import { DeviceTemperatureService } from '../device-temperature.service';
import { ApiTemperatureController } from '../api-temperature.controller';
import { ApiTemperatureService } from '../api-temperature.service';
import { TemperatureService } from '../temperature.service';

@Module({
  imports: [MqttBrokerModule, TemperatureModule, SlaveModule],
  controllers: [ApiThermometerController, ApiTemperatureController, DeviceTemperatureController],
  providers: [
    ApiTemperatureService,
    TemperatureService,
    DeviceFanService,
    DeviceThermometerService,
    DeviceTemperatureService,
    ThermometerRepository,
    TemperatureRepository,
    TemperatureQueryRepository,
    ThermometerQueryRepository,
  ],
})
export class DeviceThermometerModule {}
