import { SlaveStateDto } from '../../dto/slave-state.dto';
import { DeviceLedService } from './device-led.service';
import {
  BasePacketHeader,
  Command,
  IndexPriority,
  IotGatewayPacket,
  IoTGatewayProtocol,
  IoTProtocol,
  Led,
  LedQueryRepository,
  PacketType,
  Slave,
} from '@iot-framework/entities';
import { EPowerState } from '@iot-framework/utils';
import { MqttService } from '../../../mqtt/mqtt.service';
import { Injectable } from '@nestjs/common';
import { LedRepository } from './led.repository';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceLedPowerService {
  constructor(
    private readonly deviceLedService: DeviceLedService,
    private readonly mqttService: MqttService,
    private readonly ledRepository: LedRepository,
    private readonly ledQueryRepository: LedQueryRepository
  ) {}

  async turnPower(dto: SlaveStateDto, slave: Slave): Promise<Observable<unknown>> {
    const { powerState } = dto;

    if (powerState === EPowerState.ON) {
      const led = await this.ledQueryRepository.findOneBySlaveFK(slave.id);
      return await this.powerOn(dto, led);
    }

    return await this.powerOff(dto);
  }

  private async powerOn(dto: SlaveStateDto, led: Led) {
    return this.deviceLedService.sendConfigPacket({
      masterId: dto.masterId,
      slaveId: dto.slaveId,
      ledCycle: led.cycle,
      ledRuntime: led.runtime,
    });
  }

  private async powerOff(dto: SlaveStateDto) {
    const topic = `master/${dto.masterId}/led`;
    const powerOffPacket = this.makePowerOffPacket(dto.slaveId);

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

    return IotGatewayPacket.makePacket(PacketType.LED, packetHeader, packetBodyDataField);
  }
}
