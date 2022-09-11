import { Module } from '@nestjs/common';
import { CoreModule } from '@iot-framework/core';
import { HealthController } from './health.controller';
import { DatabaseModule, MicroserviceClientsModule, RedisModule } from '@iot-framework/modules';
import { ApiAuthModule } from './api/auth/api-auth.module';
import { ApiDeviceModule } from './api/device/api-device.module';

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    RedisModule,
    MicroserviceClientsModule,
    ApiAuthModule,
    ApiDeviceModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
