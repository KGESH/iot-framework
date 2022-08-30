import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EPowerState, ESensor } from '@iot-framework/utils';
import { SlaveStateDto } from './dto/slave-state.dto';
import { RedisTTL } from '@iot-framework/modules';

export class ApiSlaveService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /** Todo: extract to cache service & fetch DB */
  async getSensorsState(masterId: number, slaveId: number) {
    const waterDto = new SlaveStateDto(masterId, slaveId, ESensor.WATER_PUMP);
    const waterPumpPowerState = await this.getPowerState(waterDto);
    const waterPumpRunningState = await this.getRunningState(waterDto);

    const ledDto = new SlaveStateDto(masterId, slaveId, ESensor.LED);
    const ledPowerState = await this.getPowerState(ledDto);
    const ledRunningState = await this.getRunningState(ledDto);

    const fanDto = new SlaveStateDto(masterId, slaveId, ESensor.FAN);
    const fanPowerState = await this.getPowerState(fanDto);
    const fanRunningState = await this.getRunningState(fanDto);

    return {
      waterPumpPowerState,
      waterPumpRunningState,
      ledPowerState,
      ledRunningState,
      fanPowerState,
      fanRunningState,
    };
  }

  async getRunningState(dto: SlaveStateDto): Promise<EPowerState> {
    return await this.cacheManager.get<EPowerState>(dto.getStateKey());
  }

  async getPowerState(dto: SlaveStateDto): Promise<EPowerState> {
    return this.cacheManager.get<EPowerState>(dto.getPowerKey());
  }

  async cachePowerState(dto: SlaveStateDto): Promise<void> {
    const { powerState } = dto;

    await this.cacheManager.set<string>(dto.getPowerKey(), powerState, {
      ttl: RedisTTL.INFINITY,
    });
  }

  /**
   * Cache sensor running state to redis. default TTL is 'Unlimited' */
  async cacheRunningState(dto: SlaveStateDto, ttlMinute: number): Promise<void> {
    const { powerState } = dto;

    await this.cacheManager.set<string>(dto.getStateKey(), powerState, {
      ttl: ttlMinute * RedisTTL.MINUTE,
    });
  }
}
