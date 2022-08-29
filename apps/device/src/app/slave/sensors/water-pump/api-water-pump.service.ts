import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { DeviceWaterPumpService } from './device-water-pump.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { WaterPumpRepository } from './water-pump.repository';
import { ResponseEntity } from '@iot-framework/modules';
import { EPowerState, ESensor } from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';
import { SlaveCacheDto } from '../../dto/slave-cache.dto';

@Injectable()
export class ApiWaterPumpService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceWaterPumpService: DeviceWaterPumpService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly waterPumpRepository: WaterPumpRepository
  ) {}

  async setConfig(
    configDto: WaterPumpConfigDto
  ): Promise<ResponseEntity<null>> {
    const { masterId, slaveId, waterPumpRuntime } = configDto;
    await this.deviceWaterPumpService.sendConfigPacket(configDto);

    const updateSuccess = await this.updateConfig(configDto);
    if (!updateSuccess) {
      return ResponseEntity.ERROR_WITH(
        'Water pump config update fail!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = this.getPowerState(configDto);
    const powerDto = new SlaveCacheDto(
      masterId,
      slaveId,
      ESensor.WATER_PUMP,
      powerState
    );

    await this.apiSlaveService.cachePowerState(powerDto);
    await this.apiSlaveService.cacheRunningState(powerDto, waterPumpRuntime);

    return ResponseEntity.OK();
  }

  private async updateConfig(dto: WaterPumpConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(
      masterId,
      slaveId
    );

    if (!slave) {
      /** Todo: logging slave not found */
      return false;
    }

    return await this.waterPumpRepository.updateConfig(slave, dto);
  }

  private getPowerState(dto: WaterPumpConfigDto) {
    return dto.waterPumpRuntime > 0 ? EPowerState.ON : EPowerState.OFF;
  }
}
