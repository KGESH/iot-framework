import { Injectable } from '@nestjs/common';
import { MqttService } from '../../../mqtt/mqtt.service';
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
import { EPowerState } from '@iot-framework/utils';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceFanPowerService {
  constructor(private readonly mqttService: MqttService) {}

  async turnPower(slave: Slave, powerState: EPowerState): Promise<void> {
    if (powerState === EPowerState.ON) {
      this.powerOn(slave, powerState);
    }

    await this.powerOff(slave, powerState);
  }

  private powerOn(slave, powerState) {
    /** Todo: logging power state */
    console.log(`Fan power ON`, slave, powerState);
  }

  private powerOff(slave: Slave, powerState: EPowerState): Observable<unknown> {
    const topic = `master/${slave.masterId}/fan`;
    const powerOffPacket = this.makePowerOffPacket(slave.slaveId, powerState);

    return this.mqttService.publish(topic, powerOffPacket);
  }

  private makePowerOffPacket(slaveId: number, powerState: EPowerState) {
    const powerOffByte = IoTGatewayProtocol.getPowerByte(powerState);

    const bodyDataField = [powerOffByte];
    const packetHeader: BasePacketHeader = {
      start: IoTProtocol.START,
      index: IndexPriority.HIGH,
      target_id: slaveId,
      command: Command.WRITE,
      data_length: bodyDataField.length,
    };

    return IotGatewayPacket.makePacket(
      PacketType.FAN,
      packetHeader,
      bodyDataField
    );
  }
}
