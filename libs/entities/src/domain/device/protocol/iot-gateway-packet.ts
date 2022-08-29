/**
 * Do not change property name !!
 * Packet will be deserialized in H/W
 * */
import { MEMORY_ADDRESS_HIGH, MEMORY_ADDRESS_LOW } from './types/protocol.enum';
import { InternalServerErrorException } from '@nestjs/common';

export enum PacketType {
  LED = 'LED',
  WATER = 'WATER',
  TEMPERATURE = 'TEMPERATURE',
  FAN = 'FAN',
}

export interface BasePacketHeader {
  start: number;
  index: number;
  target_id: number;
  command: number;
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
  ) {
    return new IotGatewayPacket(header, {
      address_high: MEMORY_ADDRESS_HIGH.TEMPERATURE,
      address_low: MEMORY_ADDRESS_LOW.TEMPERATURE,
      data_list: dataField,
    }).serialize();
  }

  private static makeLedPacket(header: BasePacketHeader, dataField?: number[]) {
    return new IotGatewayPacket(header, {
      address_high: MEMORY_ADDRESS_HIGH.LED,
      address_low: MEMORY_ADDRESS_LOW.LED,
      data_list: dataField,
    }).serialize();
  }

  private static makeFanPacket(header: BasePacketHeader, dataField?: number[]) {
    return new IotGatewayPacket(header, {
      address_high: MEMORY_ADDRESS_HIGH.FAN,
      address_low: MEMORY_ADDRESS_LOW.FAN,
      data_list: dataField,
    }).serialize();
  }

  private static makeMotorPacket(
    header: BasePacketHeader,
    dataField?: number[]
  ) {
    return new IotGatewayPacket(header, {
      address_high: MEMORY_ADDRESS_HIGH.MOTOR,
      address_low: MEMORY_ADDRESS_LOW.MOTOR,
      data_list: dataField,
    }).serialize();
  }

  serialize() {
    return { ...this.header, ...this.body };
  }
}
