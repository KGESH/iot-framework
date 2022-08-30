/**
 * Do not change property name !!
 * Packet will be deserialized in H/W
 * */
import {
  Command,
  IndexPriority,
  IoTProtocol,
  MemoryAddressHigh,
  MemoryAddressLow,
  PowerByte,
  TargetMemoryAddress,
} from './types/protocol.enum';
import { InternalServerErrorException } from '@nestjs/common';
import { EPowerState } from '@iot-framework/utils';

export enum PacketType {
  LED = 'LED',
  WATER = 'WATER',
  TEMPERATURE = 'TEMPERATURE',
  FAN = 'FAN',
}

export interface BasePacketHeader {
  start: IoTProtocol;
  index: IndexPriority;
  target_id: TargetMemoryAddress;
  command: Command;
  data_length: number;
}

export interface BasePacketBody {
  address_high: number;
  address_low: number;
  data_list?: number[];
}

export interface BasePacket {
  header: BasePacketHeader;
  body?: BasePacketBody;
}

export type RawPacket = BasePacketHeader & BasePacketBody;

export class IoTGatewayProtocol {
  static getPowerByte(powerState: EPowerState): PowerByte {
    return powerState === EPowerState.ON ? PowerByte.ON : PowerByte.OFF;
  }

  static getSensorPowerState(runtime: number) {
    return runtime > 0 ? EPowerState.ON : EPowerState.OFF;
  }
}

export class IotGatewayPacket implements BasePacket {
  header: BasePacketHeader;
  body: BasePacketBody;

  private constructor(header: BasePacketHeader, body?: BasePacketBody) {
    this.header = header;
    this.body = body;
  }

  static makePacket(
    packetType: PacketType,
    header: BasePacketHeader,
    dataField?: number[]
  ) {
    switch (packetType) {
      case PacketType.TEMPERATURE:
        return IotGatewayPacket.makeTemperaturePacket(header, dataField);
      case PacketType.FAN:
        return IotGatewayPacket.makeFanPacket(header, dataField);
      case PacketType.LED:
        return IotGatewayPacket.makeLedPacket(header, dataField);
      case PacketType.WATER:
        return IotGatewayPacket.makeMotorPacket(header, dataField);

      default:
        /** Todo: handle packet generate exception */
        throw new InternalServerErrorException('Make packet error!');
    }
  }

  private static makeTemperaturePacket(
    header: BasePacketHeader,
    dataField?: number[]
  ): RawPacket {
    return new IotGatewayPacket(header, {
      address_high: MemoryAddressHigh.TEMPERATURE,
      address_low: MemoryAddressLow.TEMPERATURE,
      data_list: dataField,
    }).serialize();
  }

  private static makeLedPacket(
    header: BasePacketHeader,
    dataField?: number[]
  ): RawPacket {
    return new IotGatewayPacket(header, {
      address_high: MemoryAddressHigh.LED,
      address_low: MemoryAddressLow.LED,
      data_list: dataField,
    }).serialize();
  }

  private static makeFanPacket(
    header: BasePacketHeader,
    dataField?: number[]
  ): RawPacket {
    return new IotGatewayPacket(header, {
      address_high: MemoryAddressHigh.FAN,
      address_low: MemoryAddressLow.FAN,
      data_list: dataField,
    }).serialize();
  }

  private static makeMotorPacket(
    header: BasePacketHeader,
    dataField?: number[]
  ): RawPacket {
    return new IotGatewayPacket(header, {
      address_high: MemoryAddressHigh.MOTOR,
      address_low: MemoryAddressLow.MOTOR,
      data_list: dataField,
    }).serialize();
  }

  serialize(): RawPacket {
    return { ...this.header, ...this.body };
  }
}
