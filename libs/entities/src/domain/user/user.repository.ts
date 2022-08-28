import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '@iot-framework/entities';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.dataSource.getRepository(User).create(createUserDto);
      await this.dataSource.getRepository(User).save(user);

      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      if (e.code === '23505') {
        /** Todo: Handle exception */
        console.log('Dup FK!');
      }
      await queryRunner.rollbackTransaction();

      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
