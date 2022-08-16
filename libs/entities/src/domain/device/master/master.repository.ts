import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Master } from '@iot-framework/entities';

@Injectable()
export class MasterRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findMastersByUserId(userId: number): Promise<Master[]> {
    return this.dataSource.getRepository(Master).findBy({
      userFK: userId,
    });
  }
}
