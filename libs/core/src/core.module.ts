import { Global, Module } from '@nestjs/common';
import { SecretModule } from './secrets/secret.module';

@Global()
@Module({
  /** Todo: Create Log Module */
  imports: [SecretModule],
  exports: [SecretModule],
})
export class CoreModule {}
