import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SlaveStateDto } from '../../dto/slave-state.dto';
import { DeviceFanPowerService } from './device-fan-power.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { notAffected, ResponseEntity } from '@iot-framework/modules';
import { FanRepository } from './fan.repository';

@Injectable()
export class ApiFanService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceFanPowerService: DeviceFanPowerService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly fanRepository: FanRepository
  ) {}

  async turnPower(dto: SlaveStateDto) {
    const { masterId, slaveId, powerState } = dto;
    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);

    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    await this.deviceFanPowerService.turnPower(slave, powerState);

    const updateResult = await this.fanRepository.updateFanPowerState(slave, powerState);
    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Fan power state update not affected!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
