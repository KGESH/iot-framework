import { Module } from '@nestjs/common';
import { ApiFanController } from './api-fan.controller';
import { ApiFanService } from './api-fan.service';
import { DeviceFanPowerService } from './device-fan-power.service';
import { FanRepository } from './fan.repository';
import { MqttBrokerModule } from '../../../../mqtt/mqtt.module';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveService } from '../../../api-slave.service';
import { DeviceFanService } from './device-fan.service';
import { DeviceFanController } from './device-fan.controller';

@Module({
  imports: [MqttBrokerModule, SlaveModule],
  controllers: [ApiFanController, DeviceFanController],
  providers: [
    ApiFanService,
    DeviceFanPowerService,
    DeviceFanService,
    FanRepository,
    ApiSlaveService,
  ],
})
export class DeviceFanModule {}
