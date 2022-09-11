import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Sensor, Slave, SlaveQueryRepository } from '@iot-framework/entities';
import { Cache } from 'cache-manager';
import { EPowerState, SensorPowerKey, SensorRunningStateKey } from '@iot-framework/utils';
import { TemperatureRangeDto } from './thermometer/dto/temperature-range.dto';
import { DeviceFanService } from './fan/device-fan.service';
import { TemperatureService } from './temperature.service';

@Injectable()
export class DeviceTemperatureService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly temperatureService: TemperatureService,
    private readonly deviceFanService: DeviceFanService,
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

    const rangeDto = await this.temperatureService.getRangeDto(slave, temperature);
    const needCooling = await this.checkNeedCooling(slave, rangeDto);
    /** Todo: fix cooling algorithm*/
    if (needCooling) {
      console.log(`Need cooling`, needCooling);
      this.deviceFanService.cooling(slave, EPowerState.ON);
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

  private async checkNeedCooling(slave: Slave, rangeDto: TemperatureRangeDto): Promise<boolean> {
    const isFanOn = await this.isFanPowerOn(slave);
    const isFanRunning = await this.isFanRunning(slave);
    const isUnstable = rangeDto.isUnStableTemperature();

    return isFanOn && isUnstable && !isFanRunning;
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
