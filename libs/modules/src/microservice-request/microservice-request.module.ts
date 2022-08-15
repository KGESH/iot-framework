import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

/** Todo: Wrap to other protocol */
@Global()
@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  exports: [HttpModule],
})
export class MicroserviceRequestModule {}
