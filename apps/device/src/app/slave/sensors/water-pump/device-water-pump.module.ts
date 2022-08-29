import { Module } from '@nestjs/common';
import { SlaveQueryRepository, WaterPump } from '@iot-framework/entities';
import { MqttBrokerModule } from '../../../mqtt/mqtt.module';
import { ApiWaterPumpController } from './api-water-pump.controller';
import { ApiWaterPumpService } from './api-water-pump.service';
import { ApiSlaveService } from '../../api-slave.service';
import { DeviceWaterPumpService } from './device-water-pump.service';
import { WaterPumpRepository } from './water-pump.repository';

@Module({
  imports: [MqttBrokerModule, WaterPump],
  controllers: [ApiWaterPumpController],
  providers: [
    ApiWaterPumpService,
    ApiSlaveService,
    DeviceWaterPumpService,
    SlaveQueryRepository,
    WaterPumpRepository,
  ],
})
export class DeviceWaterPumpModule {}
