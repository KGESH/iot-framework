import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMasterDto } from './dto/create-master.dto';
import { Master } from '@iot-framework/entities';

@Injectable()
export class DeviceMasterRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createMaster(createMasterDto: CreateMasterDto): Promise<boolean> {
    const { userId, masterId, address } = createMasterDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const master = this.dataSource.getRepository(Master).create({
        userFK: userId,
        masterId,
        address,
      });
      await this.dataSource.getRepository(Master).save(master);

      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      /** Todo: handle exception */
      if (e.code === '23505') {
        console.log(`Create master fail!`);
        await queryRunner.rollbackTransaction();
        return false;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByMasterId(masterId: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.getRepository(Master).delete({ masterId });
      return true;
    } catch (e) {
      console.log(`Delete master fail!`);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
