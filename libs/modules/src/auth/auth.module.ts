import { Module } from '@nestjs/common';
import { UserModule } from '@iot-framework/entities';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ISecretService } from '@iot-framework/core';
import { AuthService } from './auth.service';
import { MicroserviceClientsModule } from '../microservice-client/microservice-clients.module';
import { LocalStrategy } from './guards/local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';

/** Todo: remove http module */
@Module({
  imports: [
    UserModule,
    MicroserviceClientsModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ISecretService],
      useFactory: async (secret: ISecretService) => {
        return {
          secret: secret.JWT_ACCESS_SECRET,
          signOptions: { expiresIn: secret.JWT_ACCESS_EXPIRES_IN },
        };
      },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
