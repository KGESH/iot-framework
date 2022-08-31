import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WaterPump } from '@iot-framework/entities';

@Injectable()
export class WaterPumpQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneBySlaveFK(slaveFK: number): Promise<WaterPump> {
    return this.dataSource.getRepository(WaterPump).findOneBy({ slaveFK });
  }
}
