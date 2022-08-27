import { Module } from '@nestjs/common';
import { ApiMasterModule } from './master/api-master.module';
import { ApiSlaveModule } from './slave/api-slave.module';

@Module({
  imports: [ApiMasterModule, ApiSlaveModule],
})
export class ApiDeviceModule {}
