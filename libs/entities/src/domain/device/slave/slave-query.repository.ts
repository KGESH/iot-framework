import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Slave, SlaveConfigsResponse } from '@iot-framework/entities';

@Injectable()
export class SlaveQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  findOneByMasterSlaveIds(
    masterId: number,
    slaveId: number
  ): Promise<Slave | null> {
    return this.dataSource.getRepository(Slave).findOneBy({
      master: { masterId },
      slaveId,
    });
  }

  /**
   * This query return 'any' type.
   * If you change Entity
   * Then check this query */
  async getConfigs(
    masterId: number,
    slaveId: number
  ): Promise<SlaveConfigsResponse> {
    return this.dataSource
      .getRepository(Slave)
      .createQueryBuilder('slave')
      .where(`slave.masterId = :masterId`, { masterId })
      .andWhere(`slave.slaveId = :slaveId`, { slaveId })
      .leftJoin('slave.thermometerConfig', 't')
      .leftJoin('slave.ledConfig', 'led')
      .leftJoin('slave.waterConfig', 'water')
      .select([
        't.rangeBegin AS "rangeBegin"',
        't.rangeEnd AS "rangeEnd"',
        't.updateCycle AS "updateCycle"',
        'led.cycle AS "ledCycle"',
        'led.runtime AS "ledRuntime"',
        'water.cycle AS "waterPumpCycle"',
        'water.runtime AS "waterPumpRuntime"',
      ])
      .getRawOne();
  }
}
