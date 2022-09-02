import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Temperature } from '@iot-framework/entities';
import { addDays, addHours } from 'date-fns';

@Injectable()
export class TemperatureRepository {
  constructor(private readonly dataSource: DataSource) {}

  async saveLogBySlaveFK(slaveFK: number, temperature: number): Promise<Temperature> {
    const log = this.dataSource.getRepository(Temperature).create({ slaveFK, temperature });
    return this.dataSource.getRepository(Temperature).save(log);
  }

  async createMockData(slaveFK: number, begin: Date, end: Date) {
    let currentDate: Date;
    for (currentDate = begin; currentDate < end; currentDate = addHours(currentDate, 1)) {
      const temperature = Math.floor(Math.random() * (10 - 5) + 5);
      const data = this.dataSource
        .getRepository(Temperature)
        .create({ slaveFK, temperature, createdAt: currentDate });
      await this.dataSource.getRepository(Temperature).save(data);
    }
  }
}
