import { Module } from '@nestjs/common';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveController } from './api-slave.controller';
import { DeviceSlaveService } from './device-slave.service';
import { ApiSlaveService } from './api-slave.service';

/** Todo: Add Sensors */
@Module({
  imports: [SlaveModule],
  controllers: [ApiSlaveController],
  providers: [DeviceSlaveService, ApiSlaveService],
})
export class DeviceMasterModule {}
