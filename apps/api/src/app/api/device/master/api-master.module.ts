import { Module } from '@nestjs/common';
import { ApiMasterController } from './api-master.controller';
import { ApiMasterService } from './api-master.service';
import { MasterModule } from '@iot-framework/entities';

@Module({
  imports: [MasterModule],
  controllers: [ApiMasterController],
  providers: [ApiMasterService],
  exports: [ApiMasterService],
})
export class ApiMasterModule {}
