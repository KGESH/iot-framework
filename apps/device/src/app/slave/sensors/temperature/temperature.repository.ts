import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Slave, Temperature } from '@iot-framework/entities';
import { addHours, addMinutes } from 'date-fns';

@Injectable()
export class TemperatureRepository {
  constructor(private readonly dataSource: DataSource) {}

  async deleteMockData(masterId: number, slaveId: number) {
    const slave = await this.dataSource.getRepository(Slave).findOneBy({ masterId, slaveId });
    const slaveFK = slave.id;

    return await this.dataSource.getRepository(Temperature).delete({ slaveFK });
  }

  async saveLogBySlaveFK(slaveFK: number, temperature: number): Promise<Temperature> {
    const log = this.dataSource.getRepository(Temperature).create({ slaveFK, temperature });
    return this.dataSource.getRepository(Temperature).save(log);
  }

  async createMockData(masterId: number, slaveId: number, begin: Date, end: Date) {
    /** Todo: remove after demo */
    const slave = await this.dataSource.getRepository(Slave).findOneBy({ masterId, slaveId });
    const slaveFK = slave.id;
    let currentDate: Date;
    for (currentDate = begin; currentDate < end; currentDate = addMinutes(currentDate, 10)) {
      const temperature = Math.floor(Math.random() * (25 - 20) + 20);
      const data = this.dataSource
        .getRepository(Temperature)
        .create({ slaveFK, temperature, createdAt: currentDate });
      await this.dataSource.getRepository(Temperature).save(data);
    }
  }
}
