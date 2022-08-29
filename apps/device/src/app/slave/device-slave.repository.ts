import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SlaveRepository {
  constructor(private readonly dataSource: DataSource) {}

  createSlave(master: Master, slaveId): Promise<Slave> {
    const { ledConfig, waterConfig, thermometerConfig } =
      this.createSensorsConfig();

    const slave = this.dataSource.getRepository(Slave).create({
      master,
      masterId: master.masterId,
      slaveId,
      ledConfig,
      waterConfig,
      thermometerConfig,
    });

    return this.dataSource.getRepository(Slave).save(slave);
  }

  private createSensorsConfig() {
    const ledConfig = this.dataSource
      .getRepository(Led)
      .create({ ...defaultLedConfig });

    const waterConfig = this.dataSource.getRepository(WaterPump).create({
      ...defaultWaterPumpConfig,
    });

    const thermometerConfig = this.dataSource
      .getRepository(Thermometer)
      .create({
        ...defaultThermometerConfig,
      });

    return { ledConfig, waterConfig, thermometerConfig };
  }

  async deleteSlave(masterId: number, slaveId: number) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.getRepository(Slave).delete({ masterId, slaveId });
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
