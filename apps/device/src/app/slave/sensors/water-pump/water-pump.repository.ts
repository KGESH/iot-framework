import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { Slave, WaterPump } from '@iot-framework/entities';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { ResponseEntity } from '@iot-framework/modules';
import { EPowerState } from '@iot-framework/utils';

@Injectable()
export class WaterPumpRepository {
  constructor(private readonly dataSource: DataSource) {}

  async updateWaterPumpPowerState(slave: Slave, powerState: EPowerState): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(WaterPump)
        .createQueryBuilder()
        .update(WaterPump)
        .set({ powerState })
        .where(`slave_fk = :id`, { id: slave.id })
        .returning(['runtime', 'powerState'])
        // .returning('*')
        .updateEntity(true)
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Water pump power state update error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateConfig(slave: Slave, configDto: WaterPumpConfigDto): Promise<UpdateResult> {
    const { waterPumpCycle, waterPumpRuntime } = configDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(WaterPump)
        .createQueryBuilder()
        .update(WaterPump)
        .set({ cycle: waterPumpCycle, runtime: waterPumpRuntime })
        .where(`slave_fk = :id`, { id: slave.id })
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Water pump config update fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
