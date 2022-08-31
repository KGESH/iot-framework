import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Led } from '@iot-framework/entities';

@Injectable()
export class LedQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneBySlaveFK(slaveFK: number): Promise<Led> {
    return this.dataSource.getRepository(Led).findOneBy({ slaveFK });
  }
}
