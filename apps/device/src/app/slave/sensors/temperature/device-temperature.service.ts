import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Sensor, Slave, SlaveQueryRepository } from '@iot-framework/entities';
import { Cache } from 'cache-manager';
import { EPowerState, SensorPowerKey, SensorRunningStateKey } from '@iot-framework/utils';
import { DeviceFanService } from './fan/device-fan.service';
import { TemperatureService } from './temperature.service';
import { RedisTTL } from '@iot-framework/modules';
import { ApiSlaveService } from '../../api-slave.service';
import { SlaveStateDto } from '../../dto/slave-state.dto';

@Injectable()
export class DeviceTemperatureService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly temperatureService: TemperatureService,
    private readonly deviceFanService: DeviceFanService,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly slaveQueryRepository: SlaveQueryRepository
  ) {}

  async receiveTemperature(
    masterId: number,
    slaveId: number,
    temperature: number,
    receivedAt: Date
  ): Promise<void> {
    const slave = await this.slaveQueryRepository.findOneOrFail(masterId, slaveId);
    await this.saveTemperature(slave, temperature, receivedAt);

    if (!(await this.isFanPowerOn(slave))) {
      return;
    }

    const rangeDto = await this.temperatureService.getRangeDto(slave, temperature);
    // fan 돌아가는 중일 때 이상온도 -> 가만히
    if ((await this.isFanRunning(slave)) && rangeDto.isUnStableTemperature()) {
      return;
    }

    // fan 돌아가는 중이 아닐 때 정상온도 -> 가만히
    if (!(await this.isFanRunning(slave)) && !rangeDto.isUnStableTemperature()) {
      return;
    }

    // fan 돌아가는 중일 때 정상온도 -> 팬 OFF
    if ((await this.isFanRunning(slave)) && !rangeDto.isUnStableTemperature()) {
      await this.deviceFanService.cooling(slave, EPowerState.OFF);
      const fanRunningStateDto = new SlaveStateDto(masterId, slaveId, Sensor.FAN, EPowerState.OFF);
      await this.apiSlaveService.cacheRunningState(fanRunningStateDto, RedisTTL.INFINITY);
    }

    // fan 돌아가는 중이 아닐 때 이상온도 -> 팬 ON
    if (!(await this.isFanRunning(slave)) && rangeDto.isUnStableTemperature()) {
      await this.deviceFanService.cooling(slave, EPowerState.ON);
      const fanRunningStateDto = new SlaveStateDto(masterId, slaveId, Sensor.FAN, EPowerState.ON);
      await this.apiSlaveService.cacheRunningState(fanRunningStateDto, RedisTTL.INFINITY);
    }
  }

  private async saveTemperature(slave: Slave, temperature: number, receivedAt: Date) {
    /** Todo: logging exception */
    return Promise.allSettled([
      this.temperatureService.saveLog(slave, temperature),
      this.temperatureService.cacheTemperature(slave, temperature),
      this.temperatureService.cacheDayAverage(slave, temperature, receivedAt),
    ]);
  }

  private async isFanPowerOn(slave: Slave): Promise<boolean> {
    const key = SensorPowerKey({
      sensor: Sensor.FAN,
      masterId: slave.masterId,
      slaveId: slave.slaveId,
    });

    const cachedRunningState = await this.cacheManager.get<EPowerState>(key);
    return cachedRunningState === EPowerState.ON;
  }

  private async isFanRunning(slave: Slave): Promise<boolean> {
    const key = SensorRunningStateKey({
      sensor: Sensor.FAN,
      masterId: slave.masterId,
      slaveId: slave.slaveId,
    });

    const cachedRunningState = await this.cacheManager.get<EPowerState>(key);
    return cachedRunningState === EPowerState.ON;
  }
}
