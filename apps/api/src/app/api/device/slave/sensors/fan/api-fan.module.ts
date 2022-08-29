import { Module } from '@nestjs/common';
import { ApiFanService } from './api-fan-service';
import { ApiFanController } from './api-fan.controller';

@Module({
  controllers: [ApiFanController],
  providers: [ApiFanService],
})
export class ApiFanModule {}
