import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SlaveCacheDto } from '../../dto/slave-cache.dto';
import { DeviceFanService } from './device-fan.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';
import { UpdateResult } from 'typeorm';
import { FanRepository } from './fan.repository';

@Injectable()
export class ApiFanService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceFanService: DeviceFanService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly fanRepository: FanRepository
  ) {}

  async turnPower(dto: SlaveCacheDto) {
    const { masterId, slaveId, powerState } = dto;
    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(
      masterId,
      slaveId
    );

    if (!slave) {
      throw ResponseEntity.ERROR_WITH(
        'Slave not found!',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.deviceFanService.turnPower(slave, powerState);
    const updated = await this.fanRepository.updateFanPowerState(
      slave,
      powerState
    );

    if (this.updateFail(updated)) {
      throw ResponseEntity.ERROR_WITH(
        'Fan power state update not affected!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private updateFail(updated: UpdateResult) {
    return updated.affected === 0;
  }
}
