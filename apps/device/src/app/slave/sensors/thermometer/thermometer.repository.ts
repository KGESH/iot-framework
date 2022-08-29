import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Slave, Thermometer } from '@iot-framework/entities';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';

@Injectable()
export class ThermometerRepository {
  constructor(private readonly dataSource: DataSource) {}
  async updateConfig(slave: Slave, configDto: ThermometerConfigDto) {
    const { rangeBegin, rangeEnd, updateCycle } = configDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource
        .getRepository(Thermometer)
        .createQueryBuilder()
        .update(Thermometer)
        .set({ rangeBegin, rangeEnd, updateCycle })
        .where('id = :id', { id: slave.thermometerFK })
        .execute();
      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
