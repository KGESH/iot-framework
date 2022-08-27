import { Global, Module } from '@nestjs/common';
import { AuthClientModule } from './auth/auth-client.module';
import { DeviceClientModule } from './device/device-client.module';

@Global()
@Module({
  imports: [AuthClientModule, DeviceClientModule],
  exports: [AuthClientModule, DeviceClientModule],
})
export class MicroserviceClientsModule {}
