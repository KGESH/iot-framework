import { Module } from '@nestjs/common';
import { MasterModule } from '@iot-framework/entities';
import { DeviceMasterService } from './device-master.service';
import { DeviceMasterController } from './device-master.controller';
import { ApiMasterController } from './api-master.controller';
import { DevicePollingService } from './device-polling.service';
import { DeviceMasterRepository } from './device-master.repository';

@Module({
  imports: [MasterModule],
  controllers: [DeviceMasterController, ApiMasterController],
  providers: [
    DeviceMasterService,
    DevicePollingService,
    DeviceMasterRepository,
  ],
})
export class DeviceMasterModule {}
