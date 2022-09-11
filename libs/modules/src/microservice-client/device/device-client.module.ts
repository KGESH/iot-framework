import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeviceClientService } from './device-client.service';
import { ISecretService } from '@iot-framework/core';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ISecretService],
      useFactory: (secret: ISecretService) => {
        return {
          timeout: 5000,
          maxRedirects: 5,
          // baseURL: `http://${secret.DEVICE_MS_HOST}:${secret.DEVICE_MS_PORT}/${secret.DEVICE_MS_URL_PREFIX}/`,
          baseURL: secret.DEVICE_MS_URL,
        };
      },
    }),
  ],
  providers: [DeviceClientService],
  exports: [DeviceClientService],
})
export class DeviceClientModule {}
