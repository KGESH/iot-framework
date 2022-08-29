import { Injectable } from '@nestjs/common';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { MqttService } from '../../../mqtt/mqtt.service';
import {
  BasePacketHeader,
  Command,
  IndexPriority,
  IotGatewayPacket,
  PacketType,
  START,
} from '@iot-framework/entities';

@Injectable()
export class DeviceWaterPumpService {
  constructor(private readonly mqttService: MqttService) {}

  /** Todo: combine other sensors */
  sendConfigPacket(dto: WaterPumpConfigDto) {
    const { masterId } = dto;
    const topic = `master/${masterId}/water`;
    const packet = this.makePacket(dto);

    return this.mqttService.publish(topic, packet);
  }

  private makePacket(dto: WaterPumpConfigDto) {
    const { slaveId, waterPumpRuntime, waterPumpCycle } = dto;

    const cycleHigh = (waterPumpCycle & 0xff00) / 0x100;
    const cycleLow = waterPumpCycle & 0x00ff;
    const runtimeHigh = (waterPumpRuntime & 0xff00) / 0x100;
    const runtimeLow = waterPumpRuntime & 0x00ff;

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
      PacketType.WATER,
      packetHeader,
      bodyDataField
    );
  }
}
