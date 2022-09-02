import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DeviceLedService } from './device-led.service';
import { IoTGatewayProtocol, Sensor, SlaveQueryRepository } from '@iot-framework/entities';
import { LedRepository } from './led.repository';
import { LedConfigDto } from './dto/led-config.dto';
import { SlaveStateDto } from '../../dto/slave-state.dto';
import { DeviceLedPowerService } from './device-led-power.service';
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

    const slave = await this.slaveQueryRepository.findOneOrFail(masterId, slaveId);

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
    const cacheDto = new SlaveStateDto(masterId, slaveId, Sensor.LED, powerState);

    await this.apiSlaveService.cachePowerState(cacheDto);
    await this.apiSlaveService.cacheRunningState(cacheDto, ledRuntime);
  }

  private async updateConfig(dto: LedConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneOrFail(masterId, slaveId);
    return this.ledRepository.updateLedConfig(slave, dto);
  }
}
