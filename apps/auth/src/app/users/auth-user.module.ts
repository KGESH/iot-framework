import { Module } from '@nestjs/common';
import { UserModule } from '@iot-framework/entities';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { AuthModule } from '@iot-framework/modules';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AuthUserController],
  providers: [AuthUserService],
})
export class AuthUserModule {}
