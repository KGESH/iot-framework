import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EPowerState } from '@iot-framework/utils';
import { SlaveStateDto } from './dto/slave-state.dto';
import { RedisTTL } from '@iot-framework/modules';
import { Sensor } from '@iot-framework/entities';

export class ApiSlaveService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /** Todo: extract to cache service & fetch DB */
  async getSensorsState(masterId: number, slaveId: number) {
    const waterDto = new SlaveStateDto(masterId, slaveId, Sensor.WATER_PUMP);
    const waterPumpPowerState = await this.getPowerState(waterDto);
    const waterPumpRunningState = await this.getRunningState(waterDto);

    const ledDto = new SlaveStateDto(masterId, slaveId, Sensor.LED);
    const ledPowerState = await this.getPowerState(ledDto);
    const ledRunningState = await this.getRunningState(ledDto);

    const fanDto = new SlaveStateDto(masterId, slaveId, Sensor.FAN);
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
    return await this.cacheManager.get<EPowerState>(dto.getRunningStateKey());
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
   * Cache sensors running state to redis. default TTL is 'Unlimited' */
  async cacheRunningState(dto: SlaveStateDto, ttlMinute: number): Promise<void> {
    const { powerState } = dto;

    await this.cacheManager.set<string>(dto.getRunningStateKey(), powerState, {
      ttl: ttlMinute * RedisTTL.MINUTE,
    });
  }
}
