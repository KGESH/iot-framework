import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Slave, Thermometer } from '@iot-framework/entities';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class ThermometerRepository {
  constructor(private readonly dataSource: DataSource) {}

  async updateConfig(slave: Slave, configDto: ThermometerConfigDto) {
    const { rangeBegin, rangeEnd, updateCycle } = configDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await this.dataSource
        .getRepository(Thermometer)
        .createQueryBuilder()
        .update(Thermometer)
        .set({ rangeBegin, rangeEnd, updateCycle })
        .where('id = :id', { id: slave.thermometerFK })
        .execute();
      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Thermometer config update fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
