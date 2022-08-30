import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { DeviceWaterPumpService } from './device-water-pump.service';
import { IoTGatewayProtocol, SlaveQueryRepository } from '@iot-framework/entities';
import { WaterPumpRepository } from './water-pump.repository';
import { notAffected, ResponseEntity } from '@iot-framework/modules';
import { EPowerState, ESensor } from '@iot-framework/utils';
import { ApiSlaveService } from '../../api-slave.service';
import { SlaveStateDto } from '../../dto/slave-state.dto';
import { DeviceWaterPumpPowerService } from './device-water-pump-power.service';

@Injectable()
export class ApiWaterPumpService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceWaterPumpService: DeviceWaterPumpService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly waterPumpRepository: WaterPumpRepository,
    private readonly deviceWaterPumpPowerService: DeviceWaterPumpPowerService
  ) {}

  async turnPower(dto: SlaveStateDto) {
    const { masterId, slaveId, powerState } = dto;
    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);

    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    await this.deviceWaterPumpPowerService.turnPower(slave, dto.powerState);
    const updateResult = await this.waterPumpRepository.updateWaterPumpPowerState(
      slave,
      powerState
    );

    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Water pump power state update not affected!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    console.log(`Pump update Result: `, updateResult);
    console.log(`Pump update Raw: `, updateResult.raw);

    // await this.apiSlaveService.cachePowerState(dto);
    /** Todo: Cache */
    // await this.apiSlaveService.cacheRunningState(dto, 0);
  }

  async setConfig(configDto: WaterPumpConfigDto): Promise<void> {
    const { masterId, slaveId, waterPumpRuntime } = configDto;
    await this.deviceWaterPumpService.sendConfigPacket(configDto);

    const updateResult = await this.updateConfig(configDto);
    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Water pump config update not affected!',
        HttpStatus.BAD_REQUEST
      );
    }

    const powerState = IoTGatewayProtocol.getSensorPowerState(configDto.waterPumpRuntime);
    const powerDto = new SlaveStateDto(masterId, slaveId, ESensor.WATER_PUMP, powerState);

    await this.apiSlaveService.cachePowerState(powerDto);
    await this.apiSlaveService.cacheRunningState(powerDto, waterPumpRuntime);
  }

  private async updateConfig(dto: WaterPumpConfigDto) {
    const { masterId, slaveId } = dto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);
    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    return await this.waterPumpRepository.updateConfig(slave, dto);
  }
}
