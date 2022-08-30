import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DeviceLedService } from './device-led.service';
import { IoTGatewayProtocol, SlaveQueryRepository } from '@iot-framework/entities';
import { LedRepository } from './led.repository';
import { notAffected, ResponseEntity } from '@iot-framework/modules';
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
    const updateResult = await this.ledRepository.updateLedPowerState(slave, powerState);

    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Led power state update not affected!',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async setConfig(configDto: LedConfigDto): Promise<ResponseEntity<null>> {
    const { masterId, slaveId, ledRuntime } = configDto;
    await this.deviceLedService.sendConfigPacket(configDto);

    const updateResult = await this.updateConfig(configDto);

    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Led config update not not affected!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = IoTGatewayProtocol.getSensorPowerState(ledRuntime);
    const cacheDto = new SlaveStateDto(masterId, slaveId, ESensor.LED, powerState);

    await this.apiSlaveService.cachePowerState(cacheDto);
    await this.apiSlaveService.cacheRunningState(cacheDto, ledRuntime);

    return ResponseEntity.OK();
  }

  private async updateConfig(dto: LedConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);

    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    return await this.ledRepository.updateConfig(slave, dto);
  }
}
