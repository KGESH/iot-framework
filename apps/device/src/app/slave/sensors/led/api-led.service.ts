import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DeviceLedService } from './device-led.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { LedRepository } from './led.repository';
import { ResponseEntity } from '@iot-framework/modules';
import {
  EPowerState,
  ESlaveStateTopic,
  ESlaveTurnPowerTopic,
} from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';
import { LedConfigDto } from './dto/led-config.dto';

@Injectable()
export class ApiLedService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceLedService: DeviceLedService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly ledRepository: LedRepository
  ) {}

  async setConfig(dto: LedConfigDto): Promise<ResponseEntity<null>> {
    await this.deviceLedService.sendConfigPacket(dto);

    const updateSuccess = await this.updateConfig(dto);
    if (!updateSuccess) {
      return ResponseEntity.ERROR_WITH(
        'Led config update fail!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = this.getPowerState(dto);
    await this.apiSlaveService.cacheConfig(
      dto,
      ESlaveTurnPowerTopic.LED,
      ESlaveStateTopic.LED,
      powerState
    );

    return ResponseEntity.OK();
  }

  private async updateConfig(dto: LedConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(
      masterId,
      slaveId
    );

    if (!slave) {
      /** Todo: logging slave not found */
      return false;
    }

    return await this.ledRepository.updateConfig(slave, dto);
  }

  private getPowerState(dto: LedConfigDto) {
    return dto.ledRuntime > 0 ? EPowerState.ON : EPowerState.OFF;
  }
}
