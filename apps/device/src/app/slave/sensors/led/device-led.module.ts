import { Module } from '@nestjs/common';
import { Led, LedModule, SlaveModule } from '@iot-framework/entities';
import { MqttBrokerModule } from '../../../mqtt/mqtt.module';
import { ApiLedController } from './api-led.controller';
import { ApiLedService } from './api-led.service';
import { ApiSlaveService } from '../../api-slave.service';
import { DeviceLedService } from './device-led.service';
import { LedRepository } from './led.repository';
import { DeviceLedPowerService } from './device-led-power.service';

@Module({
  imports: [MqttBrokerModule, SlaveModule, LedModule],
  controllers: [ApiLedController],
  providers: [
    ApiLedService,
    ApiSlaveService,
    DeviceLedService,
    DeviceLedPowerService,
    LedRepository,
  ],
})
export class DeviceLedModule {}
