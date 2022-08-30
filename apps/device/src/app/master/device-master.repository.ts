import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMasterDto } from './dto/create-master.dto';
import { Master } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class DeviceMasterRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createMaster(createMasterDto: CreateMasterDto): Promise<Master> {
    const { userId, masterId, address } = createMasterDto;
    const master = this.dataSource.getRepository(Master).create({
      userFK: userId,
      masterId,
      address,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createResult = await this.dataSource.getRepository(Master).save(master);
      await queryRunner.commitTransaction();

      return createResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw ResponseEntity.ERROR_WITH_DATA(
        'Master create fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByMasterId(masterId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleteResult = await this.dataSource.getRepository(Master).delete({ masterId });
      await queryRunner.commitTransaction();

      return deleteResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw ResponseEntity.ERROR_WITH_DATA(
        'Master delete fail!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }
}
