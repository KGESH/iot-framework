import { Module } from '@nestjs/common';
import { SlaveModule, TemperatureModule } from '@iot-framework/entities';
import { ApiThermometerController } from './api-thermometer.controller';
import { DeviceThermometerService } from './device-thermometer.service';
import { ThermometerRepository } from './thermometer.repository';
import { MqttBrokerModule } from '../../../mqtt/mqtt.module';

@Module({
  imports: [MqttBrokerModule, TemperatureModule, SlaveModule],
  controllers: [ApiThermometerController],
  providers: [DeviceThermometerService, ThermometerRepository],
})
export class DeviceThermometerModule {}
