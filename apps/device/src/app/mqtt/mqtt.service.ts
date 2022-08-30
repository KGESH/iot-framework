import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_TOKEN } from './enum';
import { RawPacket } from '@iot-framework/entities';

@Injectable()
export class MqttService {
  constructor(
    @Inject(MQTT_TOKEN.DEVICE_BROKER)
    private readonly broker: ClientProxy
  ) {}

  publish(topic: string, payload: RawPacket) {
    return this.broker.emit(topic, payload);
  }
}
