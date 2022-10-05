import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from './auth-client.service';
import { ISecretService } from '@iot-framework/core';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ISecretService],
      useFactory: (secret: ISecretService) => {
        return {
          timeout: 30000,
          maxRedirects: 5,
          // baseURL: `http://${secret.USER_MS_HOST}:${secret.USER_MS_PORT}/${secret.USER_MS_URL_PREFIX}/`,
          baseURL: secret.USER_MS_URL,
        };
      },
    }),
  ],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}
