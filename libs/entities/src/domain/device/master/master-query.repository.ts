import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Master } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class MasterQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneByMasterId(masterId: number): Promise<Master> {
    return this.dataSource.getRepository(Master).findOneBy({ masterId });
  }

  async findOneByMasterIdOrFail(masterId: number): Promise<Master> {
    const master = await this.dataSource.getRepository(Master).findOneBy({ masterId });
    if (!master) {
      throw ResponseEntity.ERROR_WITH(`Master Not Found!`, HttpStatus.BAD_REQUEST);
    }

    return master;
  }

  async findMastersByUserId(userId: number): Promise<Master[]> {
    return this.dataSource.getRepository(Master).findBy({
      userFK: userId,
    });
  }
}
