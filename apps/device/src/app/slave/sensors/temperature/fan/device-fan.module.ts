import { Module } from '@nestjs/common';
import { ApiFanController } from './api-fan.controller';
import { ApiFanService } from './api-fan.service';
import { DeviceFanPowerService } from './device-fan-power.service';
import { FanRepository } from './fan.repository';
import { MqttBrokerModule } from '../../../../mqtt/mqtt.module';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveService } from '../../../api-slave.service';
import { DeviceFanService } from './device-fan.service';

@Module({
  imports: [MqttBrokerModule, SlaveModule],
  controllers: [ApiFanController],
  providers: [
    ApiFanService,
    DeviceFanPowerService,
    DeviceFanService,
    FanRepository,
    ApiSlaveService,
  ],
})
export class DeviceFanModule {}
