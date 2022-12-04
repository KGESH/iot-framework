import { Module } from '@nestjs/common';
import { ApiAuthController } from './api-auth.controller';
import { ApiAuthService } from './api-auth.service';
import { AuthModule } from '@iot-framework/modules';
import { ISecretService } from '@iot-framework/core';

@Module({
  imports: [AuthModule],
  controllers: [ApiAuthController],
  providers: [ApiAuthService],
})
export class ApiAuthModule {}
