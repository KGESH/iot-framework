import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DeviceLedService } from './device-led.service';
import { IoTGatewayProtocol, Led, SlaveQueryRepository } from '@iot-framework/entities';
import { LedRepository } from './led.repository';
import { notAffected, RedisTTL, ResponseEntity } from '@iot-framework/modules';
import { LedConfigDto } from './dto/led-config.dto';
import { SlaveStateDto } from '../../dto/slave-state.dto';
import { DeviceLedPowerService } from './device-led-power.service';
import { ESensor } from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';

@Injectable()
export class ApiLedService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly deviceLedService: DeviceLedService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly deviceLedPowerService: DeviceLedPowerService,
    private readonly ledRepository: LedRepository
  ) {}

  async turnPower(dto: SlaveStateDto) {
    const { masterId, slaveId, powerState } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);
    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    await this.deviceLedPowerService.turnPower(dto, slave);
    const { runtime } = await this.ledRepository.updateLedPowerState(slave, powerState);

    await this.apiSlaveService.cachePowerState(dto);
    await this.apiSlaveService.cacheRunningState(dto, runtime);
  }

  async setConfig(configDto: LedConfigDto) {
    const { masterId, slaveId, ledRuntime } = configDto;

    await this.deviceLedService.sendConfigPacket(configDto);
    await this.updateConfig(configDto);

    const powerState = IoTGatewayProtocol.getSensorPowerState(ledRuntime);
    const cacheDto = new SlaveStateDto(masterId, slaveId, ESensor.LED, powerState);

    await this.apiSlaveService.cachePowerState(cacheDto);
    await this.apiSlaveService.cacheRunningState(cacheDto, ledRuntime);
  }

  private async updateConfig(dto: LedConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);
    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    return this.ledRepository.updateLedConfig(slave, dto);
  }
}
