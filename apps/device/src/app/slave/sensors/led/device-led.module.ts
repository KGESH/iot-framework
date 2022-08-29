import { Module } from '@nestjs/common';
import { Led, SlaveQueryRepository } from '@iot-framework/entities';
import { MqttBrokerModule } from '../../../mqtt/mqtt.module';
import { ApiLedController } from './api-led.controller';
import { ApiLedService } from './api-led.service';
import { ApiSlaveService } from '../../api-slave.service';
import { DeviceLedService } from './device-led.service';
import { LedRepository } from './led.repository';

@Module({
  imports: [MqttBrokerModule, Led],
  controllers: [ApiLedController],
  providers: [
    ApiLedService,
    ApiSlaveService,
    DeviceLedService,
    SlaveQueryRepository,
    LedRepository,
  ],
})
export class DeviceLedModule {}
