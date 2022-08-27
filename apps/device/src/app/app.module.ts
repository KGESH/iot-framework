import { Module } from '@nestjs/common';
import { CoreModule } from '@iot-framework/core';
import { HealthController } from './health.controller';
import { MqttBrokerModule } from './mqtt/mqtt.module';
import { DatabaseModule, RedisModule } from '@iot-framework/modules';
import { DeviceMasterModule } from './master/device-master.module';

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    RedisModule,
    MqttBrokerModule,
    DeviceMasterModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
