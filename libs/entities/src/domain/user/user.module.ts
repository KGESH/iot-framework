import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserQueryRepository } from './user-query.repository';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserQueryRepository],
  exports: [TypeOrmModule, UserRepository, UserQueryRepository],
})
export class UserModule {}
