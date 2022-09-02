import { Injectable } from '@nestjs/common';
import { MqttService } from '../../../../mqtt/mqtt.service';
import { EPowerState } from '@iot-framework/utils';
import {
  BasePacketHeader,
  Command,
  IndexPriority,
  IotGatewayPacket,
  IoTGatewayProtocol,
  IoTProtocol,
  PacketType,
  Slave,
} from '@iot-framework/entities';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceFanService {
  constructor(private readonly mqttService: MqttService) {}

  cooling(slave: Slave, isCooling: EPowerState): Observable<unknown> {
    const topic = `master/${slave.masterId}/fan`;
    const coolingPacket = this.makePacket(slave.slaveId, isCooling);

    return this.mqttService.publish(topic, coolingPacket);
  }

  private makePacket(slaveId: number, powerState: EPowerState) {
    const powerByte = IoTGatewayProtocol.getPowerByte(powerState);

    const bodyDataField = [powerByte];
    const packetHeader: BasePacketHeader = {
      start: IoTProtocol.START,
      index: IndexPriority.HIGH,
      target_id: slaveId,
      command: Command.WRITE,
      data_length: bodyDataField.length,
    };

    return IotGatewayPacket.makePacket(PacketType.FAN, packetHeader, bodyDataField);
  }
}
