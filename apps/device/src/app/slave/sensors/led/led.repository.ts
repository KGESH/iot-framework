import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { Led, Slave } from '@iot-framework/entities';
import { LedConfigDto } from './dto/led-config.dto';
import { EPowerState } from '@iot-framework/utils';
import { notAffected, ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class LedRepository {
  constructor(private readonly dataSource: DataSource) {}

  async updateLedPowerState(slave: Slave, powerState: EPowerState): Promise<Led> {
    const updateResult = await this.updatePowerState(slave, powerState);

    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Led power state update not affected!',
        HttpStatus.BAD_REQUEST
      );
    }

    return updateResult.raw[0];
  }

  private async updatePowerState(slave: Slave, powerState: EPowerState): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Led)
        .createQueryBuilder()
        .update({ powerState })
        .where(`slave_fk = :id`, { id: slave.id })
        .returning('*')
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ResponseEntity.ERROR_WITH_DATA(
        'Led power state update error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateLedConfig(slave: Slave, configDto: LedConfigDto): Promise<void> {
    const updateResult = await this.updateConfig(slave, configDto);
    if (notAffected(updateResult)) {
      throw ResponseEntity.ERROR_WITH(
        'Led config update not not affected!',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async updateConfig(slave: Slave, configDto: LedConfigDto): Promise<UpdateResult> {
    const { ledCycle, ledRuntime } = configDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Led)
        .createQueryBuilder()
        .update(Led)
        .set({ cycle: ledCycle, runtime: ledRuntime })
        .where('slave_fk = :id', { id: slave.id })
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ResponseEntity.ERROR_WITH_DATA(
        'Led config update error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
