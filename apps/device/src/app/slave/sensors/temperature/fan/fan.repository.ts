import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { Slave, Thermometer } from '@iot-framework/entities';
import { EPowerState } from '@iot-framework/utils';
import { notAffected, ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class FanRepository {
  constructor(private readonly dataSource: DataSource) {}

  async updateFanPowerState(slave: Slave, powerState: EPowerState): Promise<void> {
    const updateResult = await this.updatePowerState(slave, powerState);
    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Fan power state update not affected!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatePowerState(slave: Slave, powerState: EPowerState): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Thermometer)
        .createQueryBuilder()
        .update(Thermometer)
        .set({ powerState })
        .where(`slave_fk = :id`, { id: slave.id })
        .returning(['rangeBegin', 'rangeEnd', 'powerState'])
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Fan power state update error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
