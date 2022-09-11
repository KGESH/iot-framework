import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseEntity } from '@iot-framework/modules';
import { DeviceThermometerService } from './thermometer/device-thermometer.service';
import { TemperatureService } from './temperature.service';
import {
  AverageFilterSource,
  GraphPoint,
  Slave,
  SlaveQueryRepository,
  TemperatureBetweenDto,
  TemperatureQueryRepository,
} from '@iot-framework/entities';
import { TemperatureKey } from '@iot-framework/utils';
import { addDays } from 'date-fns';
import { GraphSource } from '@iot-framework/entities';

@Injectable()
export class ApiTemperatureService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly temperatureService: TemperatureService,
    private readonly deviceThermometerService: DeviceThermometerService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly temperatureQueryRepository: TemperatureQueryRepository
  ) {}

  async getTemperatures(temperatureBetweenDto: TemperatureBetweenDto) {
    const { masterId, slaveId, begin, end } = temperatureBetweenDto;

    const slave = await this.slaveQueryRepository.findOneOrFail(masterId, slaveId);
    return await this.temperatureQueryRepository.getTemperatures(slave.id, begin, end);
  }

  async getCurrentTemperature(masterId: number, slaveId: number): Promise<ResponseEntity<number>> {
    const temperature = await this.getCachedTemperature(masterId, slaveId);
    if (!temperature) {
      throw ResponseEntity.ERROR_WITH('Cached temperature not found!', HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.OK_WITH(temperature);
  }

  private async getCachedTemperature(masterId: number, slaveId: number): Promise<number> {
    const key = TemperatureKey.getCurrentKey(masterId, slaveId);
    return await this.cacheManager.get<number>(key);
  }

  async getAveragePoints(temperatureBetweenDto: TemperatureBetweenDto) {
    const { masterId, slaveId, begin, end } = temperatureBetweenDto;
    const slave = await this.slaveQueryRepository.findOneOrFail(masterId, slaveId);

    const [min, max] = await this.temperatureService.getTemperatureRange(slave);
    const keys = TemperatureKey.getDayKeys(masterId, slaveId, begin, end);

    const graphSource = await this.makeGraphSource(slave, keys, min, max);
    return graphSource.sort();
  }

  private async makeGraphSource(
    slave: Slave,
    keys: string[],
    min: number,
    max: number
  ): Promise<GraphSource> {
    const points = await Promise.all(
      keys.map(async (key) => {
        const cachedDay = await this.cacheManager.get<AverageFilterSource>(key);
        const formattedDay = TemperatureKey.getDateFromKey(key);

        if (!cachedDay) {
          const dayBegin = new Date(formattedDay);
          const dayEnd = addDays(dayBegin, 1);
          const average = await this.getAverage(slave, dayBegin, dayEnd);
          if (!average) {
            return;
          }

          await this.temperatureService.cacheDayAverage(slave, average, dayBegin);
          return new GraphPoint(formattedDay, average, min, max);
        }

        return new GraphPoint(formattedDay, cachedDay.temperatureAverage, min, max);
      })
    );

    return new GraphSource(points);
  }

  private async getAverage(slave: Slave, begin: Date, end: Date) {
    return await this.temperatureQueryRepository.getAverageBySlaveFK(slave.id, begin, end);
  }
}
