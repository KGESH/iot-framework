import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Slave } from '@iot-framework/entities';

@Injectable()
export class SlaveQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  getConfigs(masterId: number, slaveId: number) {
    return this.dataSource
      .getRepository(Slave)
      .createQueryBuilder('slave')
      .where(`slave.masterId = :masterId`, { masterId })
      .andWhere(`slave.slaveId = :slaveId`, { slaveId })
      .leftJoinAndSelect('slave.thermometerConfig', 't')
      .leftJoinAndSelect('slave.ledConfig', 'led')
      .leftJoinAndSelect('slave.waterConfig', 'water')
      .select([
        't.rangeBegin AS rangeBegin',
        't.rangeEnd AS rangeEnd',
        't.updateCycle AS updateCycle',
        'led.ledCycle AS ledCycle',
        'led.ledRuntime AS ledRuntime',
        'water.waterPumpCycle AS waterPumpCycle',
        'water.waterPumpRuntime AS waterPumpRuntime',
      ])
      .getRawOne();
  }

  async deleteSlave(masterId: number, slaveId: number) {
    return this.dataSource
      .getRepository(Slave)
      .createQueryBuilder()
      .delete()
      .from(Slave)
      .where(`masterId = :masterId`, { masterId })
      .andWhere(`slaveId = :slaveId`, { slaveId })
      .execute();
  }
}
