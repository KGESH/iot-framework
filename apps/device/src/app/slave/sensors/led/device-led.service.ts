import { Injectable } from '@nestjs/common';
import { MqttService } from '../../../mqtt/mqtt.service';
import {
  IotGatewayPacket,
  Command,
  IndexPriority,
  START,
  BasePacketHeader,
  PacketType,
} from '@iot-framework/entities';
import { LedConfigDto } from './dto/led-config.dto';

@Injectable()
export class DeviceLedService {
  constructor(private readonly mqttService: MqttService) {}

  sendConfigPacket(dto: LedConfigDto) {
    const { masterId } = dto;
    const topic = `master/${masterId}/led`;
    const packet = this.makePacket(dto);
    return this.mqttService.publish(topic, packet);
  }

  private makePacket(dto: LedConfigDto) {
    const { slaveId, ledRuntime, ledCycle } = dto;

    const cycleHigh = (ledCycle & 0xff00) / 0x100;
    const cycleLow = ledCycle & 0x00ff;
    const runtimeHigh = (ledRuntime & 0xff00) / 0x100;
    const runtimeLow = ledRuntime & 0x00ff;

    /** On / Off Event : 0xaa
     *  No Event : 0xaf
     * */
    const bodyDataField = [0xaa, cycleHigh, cycleLow, runtimeHigh, runtimeLow];
    const packetHeader: BasePacketHeader = {
      start: START,
      index: IndexPriority.COMMON,
      target_id: slaveId,
      command: Command.WRITE,
      data_length: bodyDataField.length,
    };

    return IotGatewayPacket.makePacket(
      PacketType.LED,
      packetHeader,
      bodyDataField
    );
  }
}
