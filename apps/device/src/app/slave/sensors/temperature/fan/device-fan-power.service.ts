import { Injectable } from '@nestjs/common';
import { MqttService } from '../../../../mqtt/mqtt.service';
import { Slave } from '@iot-framework/entities';
import { EPowerState } from '@iot-framework/utils';
import { Observable } from 'rxjs';
import { DeviceFanService } from './device-fan.service';
import { ApiSlaveService } from '../../../api-slave.service';
import { FanRepository } from './fan.repository';
import { SlaveStateDto } from '../../../dto/slave-state.dto';
import { RedisTTL } from '@iot-framework/modules';

@Injectable()
export class DeviceFanPowerService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly deviceFanService: DeviceFanService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly fanRepository: FanRepository
  ) {}

  async turnPower(slave: Slave, dto: SlaveStateDto): Promise<void> {
    if (dto.powerState === EPowerState.OFF) {
      await this.powerOff(slave, dto);
    }

    await this.powerOn(slave, dto);
  }

  private async powerOn(slave, dto: SlaveStateDto): Promise<void> {
    /** Todo: logging power state */
    console.log(`Fan power ON`, slave, dto.powerState);
    await this.fanRepository.updateFanPowerState(slave, dto.powerState);
    await this.apiSlaveService.cachePowerState(dto);
  }

  private async powerOff(slave: Slave, dto: SlaveStateDto): Promise<void> {
    /** Do not change call sequence */
    await this.deviceFanService.cooling(slave, dto.powerState);
    await this.fanRepository.updateFanPowerState(slave, dto.powerState);
    await this.apiSlaveService.cachePowerState(dto);
    await this.apiSlaveService.cacheRunningState(dto, RedisTTL.INFINITY);
  }
}
