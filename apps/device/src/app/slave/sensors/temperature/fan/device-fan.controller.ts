import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common';
import { ApiFanService } from './api-fan.service';
import { SlaveStateDto } from '../../../dto/slave-state.dto';
import { RedisTTL } from '@iot-framework/modules';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import {
  EPowerState,
  ESlaveConfigTopic,
  SensorConfigKey,
  SensorRunningStateKey,
} from '@iot-framework/utils';
import { Cache } from 'cache-manager';
import { Sensor } from '@iot-framework/entities';

@Controller()
export class DeviceFanController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiFanService: ApiFanService
  ) {}

  @EventPattern('master/+/slave/+/fan/state/response')
  async receiveFanState(@Payload() payload: any, @Ctx() context: MqttContext) {
    console.log(context.getPacket());
    const [, mId, , sId] = context.getTopic().split('/');
    const masterId = parseInt(mId);
    const slaveId = parseInt(sId);

    const dto = new SlaveStateDto(masterId, slaveId, Sensor.FAN, EPowerState.ON);
    await this.cacheFanState(dto);
  }

  private async cacheFanState(stateDto: SlaveStateDto) {
    const { masterId, slaveId } = stateDto;
    const key = SensorRunningStateKey({
      sensor: stateDto.sensor,
      masterId,
      slaveId,
    });

    const cachedResult = await this.cacheManager.set<EPowerState>(key, stateDto.powerState, {
      ttl: RedisTTL.MINUTE * 3,
    });

    console.log(`Cached: `, cachedResult);
    if (!cachedResult) {
      /** Todo: logging cache error */
    }
  }
  //   console.log('payload', payload);
  //   console.log(context.getTopic());
  //   console.log(context.getPacket());
  // }
  //   try {
  //     await this.apiFanService.turnPower(dto);
  //     return ResponseEntity.OK();
  //   } catch (e) {
  //     return e;
  //   }
  // }
}
