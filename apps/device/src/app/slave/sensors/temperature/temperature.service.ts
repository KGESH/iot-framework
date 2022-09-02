import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Slave, ThermometerQueryRepository } from '@iot-framework/entities';
import { ESlaveConfigTopic, SensorConfigKey } from '@iot-framework/utils';
import { RedisTTL } from '@iot-framework/modules';
import { Cache } from 'cache-manager';
import { DeviceFanService } from './fan/device-fan.service';
import { TemperatureRangeDto } from './thermometer/dto/temperature-range.dto';
import { TemperatureKey } from '@iot-framework/utils';
import { AverageFilterSource, DayAverage } from '@iot-framework/entities';
import { TemperatureRepository } from './temperature.repository';

@Injectable()
export class TemperatureService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceFanService: DeviceFanService,
    private readonly thermometerRepository: ThermometerQueryRepository,
    private readonly temperatureRepository: TemperatureRepository
  ) {}

  async saveLog(slave: Slave, temperature: number) {
    return this.temperatureRepository.saveLogBySlaveFK(slave.id, temperature);
  }

  async cacheTemperature(slave: Slave, temperature: number): Promise<unknown> {
    const key = TemperatureKey.getCurrentKey(slave.masterId, slave.slaveId);
    return this.cacheManager.set<number>(key, temperature, {
      ttl: RedisTTL.MINUTE,
    });
  }

  async cacheDayAverage(slave: Slave, temperature: number, date: Date) {
    const dayAverageKey = TemperatureKey.getDayKey(slave.masterId, slave.slaveId, date);
    const cachedAverageFilterSource = await this.cacheManager.get<AverageFilterSource>(
      dayAverageKey
    );

    if (!cachedAverageFilterSource) {
      const averageFilter = DayAverage.createNewAverageFilter(temperature);
      const averageFilterSource = averageFilter.getAverageFilterSource();
      return this.cacheManager.set<AverageFilterSource>(dayAverageKey, averageFilterSource, {
        ttl: RedisTTL.WEEK,
      });
    }

    const averageFilter = DayAverage.createAverageFilter(cachedAverageFilterSource);
    const updatedFilterSource = averageFilter.getUpdateAverageFilterSource(temperature);
    return this.cacheManager.set<AverageFilterSource>(dayAverageKey, updatedFilterSource, {
      ttl: RedisTTL.WEEK,
    });
  }

  async getRangeDto(slave: Slave, temperature) {
    const [rangeMin, rangeMax] = await this.getTemperatureRange(slave);
    return new TemperatureRangeDto(temperature, rangeMin, rangeMax);
  }

  async getTemperatureRange(slave: Slave): Promise<number[]> {
    const key = SensorConfigKey({
      sensor: ESlaveConfigTopic.THERMOMETER,
      masterId: slave.masterId,
      slaveId: slave.slaveId,
    });

    const cachedRange = await this.cacheManager.get<number[]>(key);
    if (cachedRange) {
      return cachedRange;
    }

    const thermometerConfig = await this.thermometerRepository.findOneBySlaveFK(slave.id);
    const range = [thermometerConfig.rangeBegin, thermometerConfig.rangeEnd];
    await this.cacheManager.set<number[]>(key, range, { ttl: RedisTTL.HOUR });

    return range;
  }
}
