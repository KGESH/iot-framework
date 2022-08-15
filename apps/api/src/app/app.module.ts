import { Module } from '@nestjs/common';
import { CoreModule } from '@iot-framework/core';
import { HealthController } from './health.controller';
import { MicroserviceRequestModule, RedisModule } from '@iot-framework/modules';

@Module({
  imports: [CoreModule, RedisModule, MicroserviceRequestModule],
  controllers: [HealthController],
})
export class AppModule {}
