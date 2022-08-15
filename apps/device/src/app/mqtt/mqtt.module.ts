import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_TOKEN } from './enum';
import { MqttService } from './mqtt.service';
import { ISecretService } from '@iot-framework/core';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MQTT_TOKEN.DEVICE_BROKER,
        inject: [ISecretService],
        useFactory: ({ MQTT_BROKER_URL }: ISecretService) => ({
          transport: Transport.MQTT,
          options: { url: MQTT_BROKER_URL },
        }),
      },
    ]),
  ],
  providers: [MqttService],
  exports: [ClientsModule, MqttService],
})
export class MqttBrokerModule {}
