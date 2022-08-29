import { Module } from '@nestjs/common';
import { ApiLedController } from './api-led-controller';
import { ApiLedService } from './api-led.service';

@Module({
  controllers: [ApiLedController],
  providers: [ApiLedService],
})
export class ApiLedModule {}
