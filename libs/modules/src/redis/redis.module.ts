import { CacheModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ISecretService } from '@iot-framework/core';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: RedisService,
      inject: [ISecretService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
