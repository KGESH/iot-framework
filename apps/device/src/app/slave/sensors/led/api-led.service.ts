import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DeviceLedService } from './device-led.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { LedRepository } from './led.repository';
import { ResponseEntity } from '@iot-framework/modules';
import { EPowerState, ESensor } from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';
import { LedConfigDto } from './dto/led-config.dto';
import { UpdateResult } from 'typeorm';
import { SlaveCacheDto } from '../../dto/slave-cache.dto';

@Injectable()
export class ApiLedService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceLedService: DeviceLedService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly ledRepository: LedRepository
  ) {}

  // async turnPower(dto: SlaveCacheDto) {
  //   const { masterId, slaveId, powerState } = dto;
  //   const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(
  //     masterId,
  //     slaveId
  //   );
  //
  //   if (!slave) {
  //     return ResponseEntity.ERROR_WITH(
  //       'Slave not found!',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  //
  //   await this.deviceLedService.turnPower(slave, powerState);
  //   const updated = await this.ledRepository.updateLedPowerState(
  //     slave,
  //     powerState
  //   );
  //
  //   if (this.updateFail(updated)) {
  //     return ResponseEntity.ERROR_WITH(
  //       'Led power state update not affected!',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  //
  //   await this.cachePowerState(slave, powerState);
  //   await this.cacheRunningState(slave, powerState);
  //
  //   return ResponseEntity.OK();
  //
  //   return '';
  // }

  private updateFail(updated: UpdateResult) {
    return updated.affected === 0;
  }

  async setConfig(configDto: LedConfigDto): Promise<ResponseEntity<null>> {
    const { masterId, slaveId, ledRuntime } = configDto;
    await this.deviceLedService.sendConfigPacket(configDto);

    const updateSuccess = await this.updateConfig(configDto);
    if (!updateSuccess) {
      return ResponseEntity.ERROR_WITH(
        'Led config update fail!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = this.getPowerState(configDto);
    const cacheDto = new SlaveCacheDto(
      masterId,
      slaveId,
      ESensor.LED,
      powerState
    );

    await this.apiSlaveService.cachePowerState(cacheDto);
    await this.apiSlaveService.cacheRunningState(cacheDto, ledRuntime);

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
