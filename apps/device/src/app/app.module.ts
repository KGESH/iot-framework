import { Module } from '@nestjs/common';
import { CoreModule } from '@iot-framework/core';
import { HealthController } from './health.controller';
import { MqttBrokerModule } from './mqtt/mqtt.module';
import { DatabaseModule, RedisModule } from '@iot-framework/modules';

@Module({
  imports: [CoreModule, DatabaseModule, RedisModule, MqttBrokerModule],
  controllers: [HealthController],
})
export class AppModule {}
