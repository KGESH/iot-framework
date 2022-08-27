import { Module } from '@nestjs/common';
import { ApiSlaveController } from './api-slave.controller';
import { SlaveModule } from '@iot-framework/entities';
import { ApiSlaveService } from './api-slave.service';
import { ApiMasterService } from '../master/api-master.service';
import { ApiMasterModule } from '../master/api-master.module';

@Module({
  imports: [ApiMasterModule, SlaveModule],
  controllers: [ApiSlaveController],
  providers: [ApiMasterService, ApiSlaveService],
  exports: [ApiSlaveService],
})
export class ApiSlaveModule {}
