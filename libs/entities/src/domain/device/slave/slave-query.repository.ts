import { DataSource } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Slave, SlaveConfigsResponse } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class SlaveQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneByMasterFK(masterFK: number): Promise<Slave | null> {
    return this.dataSource.getRepository(Slave).findOneBy({ masterFK });
  }

  /** If slave is not exist. then return null. */
  async findOneByMasterSlaveIds(masterId: number, slaveId: number): Promise<Slave> {
    return this.dataSource.getRepository(Slave).findOneBy({
      master: { masterId },
      slaveId,
    });
  }

  /** If slave is not exist. then throw error response. */
  async findOneOrFail(masterId: number, slaveId: number): Promise<Slave> {
    const slave = await this.dataSource.getRepository(Slave).findOneBy({
      master: { masterId },
      slaveId,
    });
    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    return slave;
  }

  /**
   * This query return 'any' type.
   * If you change Entity
   * Then check this query */
  async getConfigs(masterId: number, slaveId: number): Promise<SlaveConfigsResponse> {
    try {
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
    } catch (error) {
      throw ResponseEntity.ERROR_WITH_DATA(
        'Slave config fetch error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
}
