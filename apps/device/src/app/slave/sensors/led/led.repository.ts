import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { Led, Slave } from '@iot-framework/entities';
import { LedConfigDto } from './dto/led-config.dto';
import { EPowerState } from '@iot-framework/utils';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class LedRepository {
  constructor(private readonly dataSource: DataSource) {}

  async updateLedPowerState(
    slave: Slave,
    powerState: EPowerState
  ): Promise<UpdateResult> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Led)
        .createQueryBuilder()
        .update({ powerState })
        .where(`id = :id`, { id: slave.ledFK })
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

  async updateConfig(
    slave: Slave,
    configDto: LedConfigDto
  ): Promise<UpdateResult> {
    const { ledCycle, ledRuntime } = configDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Led)
        .createQueryBuilder()
        .update(Led)
        .set({ cycle: ledCycle, runtime: ledRuntime })
        .where('id = :id', { id: slave.ledFK })
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
}
