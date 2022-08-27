import { Module } from '@nestjs/common';
import { CoreModule } from '@iot-framework/core';
import { DatabaseModule, RedisModule } from '@iot-framework/modules';
import { AuthUserModule } from './users/auth-user.module';

@Module({
  imports: [CoreModule, DatabaseModule, RedisModule, AuthUserModule],
})
export class AppModule {}
