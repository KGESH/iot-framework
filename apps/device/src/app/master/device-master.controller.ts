import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload, Transport } from '@nestjs/microservices';

import { DevicePollingService } from './device-polling.service';
import { Cache } from 'cache-manager';
import { MasterPollingKey, POLLING } from '@iot-framework/utils';
import { EPollingState } from './types/polling.enum';
import { RedisTTL } from '@iot-framework/modules';

@Controller()
export class DeviceMasterController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly pollingService: DevicePollingService
  ) {}

  /**
   * Todo: Validate Polling Status Is Number */
  @EventPattern(POLLING, Transport.MQTT)
  async receivePollingResult(@Ctx() context: MqttContext, @Payload() pollingStatus: EPollingState) {
    const key = MasterPollingKey(context.getTopic());
    // master/+/polling
    const replaced = 'master/20480/polling';
    // console.log(`이전 상태 값: `, await this.cacheManager.get<number>(key));

    if (pollingStatus !== EPollingState.OK) {
      /**
       * Todo: Trigger Some Mock Method */
      console.log(`Polling 값 문제 발생`);
      console.log(`추후 여기서 트리거 발생`);
      this.pollingService.mockPollingExceptionTrigger(context, pollingStatus);
    }

    /** Cache Status To Redis */
    await this.cacheManager.set<number>(replaced, pollingStatus, { ttl: RedisTTL.MINUTE });
    // await this.cacheManager.set<number>(key, pollingStatus, { ttl: RedisTTL.MINUTE });
  }

  /**
   * Todo: Slave 펌웨어 수정 이후 제거 예정 */
  @EventPattern('master/+/assert', Transport.MQTT)
  async receiveAssert(@Payload() data: string, @Ctx() context: MqttContext) {
    console.log(`receive Assert packet: `, context.getPacket());

    console.log(`receive value `, data);
  }

  /**
   * Todo: Slave 펌웨어 수정 이후 제거 예정 */
  @EventPattern('master/+/assert/#', Transport.MQTT)
  async receiveMockAssert(@Payload() data: string, @Ctx() context: MqttContext) {
    console.log(`receive Assert packet: `, context.getPacket());

    console.log(`receive value `, data);
  }
  /**
   * Todo: Slave 펌웨어 수정 이후 제거 예정 */
  @EventPattern('master/+/error', Transport.MQTT)
  async receiveError(@Payload() data: string, @Ctx() context: MqttContext) {
    console.log(`receive Error packet: `, context.getPacket());

    console.log(`receive value `, data);
  }
}
