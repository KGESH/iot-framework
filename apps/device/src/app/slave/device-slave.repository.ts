import { DataSource } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  defaultLedConfig,
  defaultThermometerConfig,
  defaultWaterPumpConfig,
  Led,
  Master,
  Slave,
  Thermometer,
  WaterPump,
} from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class SlaveRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createSlave(master: Master, slaveId): Promise<Slave> {
    const { ledConfig, waterConfig, thermometerConfig } = this.createSensorsConfig();

    const slave = this.dataSource.getRepository(Slave).create({
      master,
      masterId: master.masterId,
      slaveId,
      ledConfig,
      waterConfig,
      thermometerConfig,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const saveResult = await this.dataSource.getRepository(Slave).save(slave);
      await queryRunner.commitTransaction();

      return saveResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      throw ResponseEntity.ERROR_WITH_DATA(
        `Slave Create Error!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  private createSensorsConfig() {
    const ledConfig = this.dataSource.getRepository(Led).create({ ...defaultLedConfig });

    const waterConfig = this.dataSource.getRepository(WaterPump).create({
      ...defaultWaterPumpConfig,
    });

    const thermometerConfig = this.dataSource.getRepository(Thermometer).create({
      ...defaultThermometerConfig,
    });

    return { ledConfig, waterConfig, thermometerConfig };
  }

  async deleteSlave(masterId: number, slaveId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleteResult = await this.dataSource.getRepository(Slave).delete({ masterId, slaveId });
      await queryRunner.commitTransaction();

      return deleteResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Slave delete fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
