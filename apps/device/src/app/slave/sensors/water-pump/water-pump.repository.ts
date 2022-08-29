import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Slave, WaterPump } from '@iot-framework/entities';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';

@Injectable()
export class WaterPumpRepository {
  constructor(private readonly dataSource: DataSource) {}
  async updateConfig(
    slave: Slave,
    configDto: WaterPumpConfigDto
  ): Promise<boolean> {
    const { waterPumpCycle, waterPumpRuntime } = configDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource
        .getRepository(WaterPump)
        .createQueryBuilder()
        .update(WaterPump)
        .set({ cycle: waterPumpCycle, runtime: waterPumpRuntime })
        .where('id = :id', { id: slave.waterPumpFK })
        .execute();
      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      /** Todo: logging update fail */
      console.log(e);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
