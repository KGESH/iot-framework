import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.dataSource.getRepository(User).findOneBy({ email });
  }

  async findOneUserById(userId: number) {
    return this.dataSource.getRepository(User).findOneBy({ id: userId });
  }
}
