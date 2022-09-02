import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SlaveStateDto } from '../../../dto/slave-state.dto';
import { DeviceFanPowerService } from './device-fan-power.service';
import { SensorPowerDto, Slave, SlaveQueryRepository } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';
import { FanRepository } from './fan.repository';
import { ApiSlaveService } from '../../../api-slave.service';
import { EPowerState } from '@iot-framework/utils';

@Injectable()
export class ApiFanService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceFanPowerService: DeviceFanPowerService,
    private readonly slaveQueryRepository: SlaveQueryRepository
  ) {}

  async turnPower(dto: SlaveStateDto): Promise<void> {
    const slave = await this.slaveQueryRepository.findOneOrFail(dto.masterId, dto.slaveId);

    await this.deviceFanPowerService.turnPower(slave, dto);
  }
}
