import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { DeviceWaterPumpService } from './device-water-pump.service';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { WaterPumpRepository } from './water-pump.repository';
import { ResponseEntity } from '@iot-framework/modules';
import {
  EPowerState,
  ESlaveStateTopic,
  ESlaveTurnPowerTopic,
} from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';

@Injectable()
export class ApiWaterPumpService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceWaterPumpService: DeviceWaterPumpService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly waterPumpRepository: WaterPumpRepository
  ) {}

  async setConfig(dto: WaterPumpConfigDto): Promise<ResponseEntity<null>> {
    const packet = await this.deviceWaterPumpService.sendConfigPacket(dto);

    const updateSuccess = await this.updateConfig(dto);
    if (!updateSuccess) {
      return ResponseEntity.ERROR_WITH(
        'Water pump config update fail!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = this.getPowerState(dto);
    await this.apiSlaveService.cacheConfig(
      dto,
      ESlaveTurnPowerTopic.WATER_PUMP,
      ESlaveStateTopic.WATER_PUMP,
      powerState
    );

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
