import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { POLLING } from '@iot-framework/utils';
import { EPollingState } from './types/polling.enum';

@Injectable()
export class DevicePollingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getPollingState(masterId: number) {
    /**
     * Todo: Make Polling Packet
     *       & Extract Method */
    const makeKey = (masterId: number) => POLLING.replace('+', `${masterId}`);
    const pollingKey = makeKey(masterId);

    return await this.cacheManager.get<number>(pollingKey);
  }

  mockPollingExceptionTrigger(
    mockContext: MqttContext,
    mockPayload: EPollingState
  ) {
    console.log(`추후 작동할 mock 트리거`);
    console.log(`Topic: `, mockContext.getTopic());
    console.log(`Payload: `, mockPayload);
  }
}
