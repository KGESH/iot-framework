import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Temperature } from '@iot-framework/entities';

@Injectable()
export class TemperatureQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  /** Todo: replace after demo */
  async getTemperatures(slaveFK: number, begin: Date, end: Date) {
    return this.dataSource
      .getRepository(Temperature)
      .createQueryBuilder()
      .select(['temperature AS x', 'created_at AS y'])
      .where(`slave_fk = :id`, { id: slaveFK })
      .andWhere(`created_at BETWEEN :begin AND :end`, { begin, end })
      .limit(100000)
      .getRawMany();
  }

  async getAverageBySlaveFK(slaveFK: number, begin: Date, end: Date): Promise<number> {
    const { average } = await this.dataSource
      .getRepository(Temperature)
      .createQueryBuilder()
      .select('AVG(temperature)', 'average')
      .where(`slave_fk = :id`, { id: slaveFK })
      .andWhere(`created_at BETWEEN :begin AND :end`, { begin, end })
      .limit(10)
      .getRawOne();

    if (!average) {
      console.log(`Average get fail!`);
    }

    return average;
  }
}
