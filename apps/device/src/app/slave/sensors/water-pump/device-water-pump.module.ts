import { Module } from '@nestjs/common';
import { SlaveModule, WaterPumpModule } from '@iot-framework/entities';
import { MqttBrokerModule } from '../../../mqtt/mqtt.module';
import { ApiWaterPumpController } from './api-water-pump.controller';
import { ApiWaterPumpService } from './api-water-pump.service';
import { ApiSlaveService } from '../../api-slave.service';
import { DeviceWaterPumpService } from './device-water-pump.service';
import { WaterPumpRepository } from './water-pump.repository';
import { DeviceWaterPumpPowerService } from './device-water-pump-power.service';

@Module({
  imports: [MqttBrokerModule, WaterPumpModule, SlaveModule],
  controllers: [ApiWaterPumpController],
  providers: [
    ApiWaterPumpService,
    ApiSlaveService,
    DeviceWaterPumpPowerService,
    DeviceWaterPumpService,
    WaterPumpRepository,
  ],
})
export class DeviceWaterPumpModule {}
