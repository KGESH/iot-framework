import { Injectable } from '@nestjs/common';
import { MqttService } from '../../../mqtt/mqtt.service';
import {
  BasePacketHeader,
  Command,
  IndexPriority,
  IotGatewayPacket,
  IoTGatewayProtocol,
  IoTProtocol,
  WaterPump,
  PacketType,
  Slave,
  WaterPumpQueryRepository,
} from '@iot-framework/entities';
import { EPowerState } from '@iot-framework/utils';
import { Observable } from 'rxjs';
import { WaterPumpRepository } from './water-pump.repository';
import { DeviceWaterPumpService } from './device-water-pump.service';

@Injectable()
export class DeviceWaterPumpPowerService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly deviceWaterPumpService: DeviceWaterPumpService,
    private readonly waterPumpRepository: WaterPumpRepository,
    private readonly waterPumpQueryRepository: WaterPumpQueryRepository
  ) {}

  async turnPower(slave: Slave, powerState: EPowerState): Promise<Observable<unknown>> {
    if (powerState === EPowerState.ON) {
      const waterPump = await this.waterPumpQueryRepository.findOneBySlaveFK(slave.id);
      return await this.powerOn(slave, waterPump);
    }

    return await this.powerOff(slave);
  }

  private async powerOn(slave: Slave, water: WaterPump) {
    return this.deviceWaterPumpService.sendConfigPacket({
      masterId: slave.masterId,
      slaveId: slave.slaveId,
      waterPumpCycle: water.cycle,
      waterPumpRuntime: water.runtime,
    });
  }

  private async powerOff(slave: Slave) {
    const topic = `master/${slave.masterId}/water`;
    const powerOffPacket = this.makePowerOffPacket(slave.slaveId);

    return this.mqttService.publish(topic, powerOffPacket);
  }

  private makePowerOffPacket(slaveId: number) {
    const powerByte = IoTGatewayProtocol.getPowerByte(EPowerState.OFF);

    const packetBodyDataField = [powerByte];
    const packetHeader: BasePacketHeader = {
      start: IoTProtocol.START,
      index: IndexPriority.HIGH,
      target_id: slaveId,
      command: Command.WRITE,
      data_length: packetBodyDataField.length,
    };

    return IotGatewayPacket.makePacket(PacketType.WATER, packetHeader, packetBodyDataField);
  }
}
