import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Led, Slave } from '@iot-framework/entities';
import { LedConfigDto } from './dto/led-config.dto';

@Injectable()
export class LedRepository {
  constructor(private readonly dataSource: DataSource) {}
  async updateConfig(slave: Slave, configDto: LedConfigDto): Promise<boolean> {
    const { ledCycle, ledRuntime } = configDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource
        .getRepository(Led)
        .createQueryBuilder()
        .update(Led)
        .set({ cycle: ledCycle, runtime: ledRuntime })
        .where('id = :id', { id: slave.ledFK })
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
