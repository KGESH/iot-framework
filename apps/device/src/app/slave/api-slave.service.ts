import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SlaveStateDto } from './dto/slave-state.dto';
import { SensorStateDto } from './dto/sensor-state.dto';
import {
  EPowerState,
  ESlaveStateTopic,
  ESlaveTurnPowerTopic,
  SensorPowerKey,
  SensorStateKey,
} from '@iot-framework/utils';
import { SlaveConfigDto } from './dto/slave-config.dto';

export class ApiSlaveService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getSensorsState(slaveStateDto: SlaveStateDto): Promise<SensorStateDto> {
    const waterPumpRunningState = await this.getRunningState(
      slaveStateDto,
      ESlaveStateTopic.WATER_PUMP
    );
    const ledRunningState = await this.getRunningState(
      slaveStateDto,
      ESlaveStateTopic.LED
    );
    const fanRunningState = await this.getRunningState(
      slaveStateDto,
      ESlaveStateTopic.FAN
    );
    const waterPumpPowerState = await this.getPowerState(
      slaveStateDto,
      ESlaveTurnPowerTopic.WATER_PUMP
    );
    const ledPowerState = await this.getPowerState(
      slaveStateDto,
      ESlaveTurnPowerTopic.LED
    );
    const fanPowerState = await this.getPowerState(
      slaveStateDto,
      ESlaveTurnPowerTopic.FAN
    );

    return {
      waterPumpRunningState,
      waterPumpPowerState,
      ledRunningState,
      ledPowerState,
      fanRunningState,
      fanPowerState,
    };
  }

  async getRunningState(
    { masterId, slaveId }: SlaveStateDto,
    sensor: ESlaveStateTopic
  ): Promise<EPowerState> {
    const key = SensorStateKey({ sensor, masterId, slaveId });
    return await this.cacheManager.get<EPowerState>(key);
  }

  async getPowerState(
    { masterId, slaveId }: SlaveStateDto,
    sensor: ESlaveTurnPowerTopic
  ): Promise<EPowerState> {
    const key = SensorPowerKey({ sensor, masterId, slaveId });
    return this.cacheManager.get<EPowerState>(key);
  }

  async cacheConfig(
    dto: Partial<SlaveConfigDto>,
    powerTopic: ESlaveTurnPowerTopic,
    runningTopic: ESlaveStateTopic,
    powerState: EPowerState
  ) {
    await this.cachePowerState(dto, powerTopic, powerState);
    await this.cacheRunningState(dto, runningTopic, powerState);
  }

  async cachePowerState(
    dto: Partial<SlaveConfigDto>,
    powerTopic: ESlaveTurnPowerTopic,
    powerState: EPowerState
  ) {
    const powerStateKey = SensorPowerKey({
      sensor: powerTopic,
      masterId: dto.masterId,
      slaveId: dto.slaveId,
    });

    await this.cacheManager.set<string>(powerStateKey, powerState, {
      ttl: 0,
    });
  }

  async cacheRunningState(
    dto: Partial<SlaveConfigDto>,
    runningTopic: ESlaveStateTopic,
    powerState: EPowerState
  ) {
    const runningStateKey = SensorStateKey({
      sensor: runningTopic,
      masterId: dto.masterId,
      slaveId: dto.slaveId,
    });

    await this.cacheManager.set<string>(runningStateKey, powerState, {
      ttl: dto.waterPumpRuntime * 60,
    });
  }
}
