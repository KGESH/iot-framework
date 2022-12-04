import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { SlaveStateDto } from './dto/slave-state.dto';
import { Sensor } from '@iot-framework/entities';
import { Cache } from 'cache-manager';
import { RedisTTL } from '@iot-framework/modules';

@Controller()
export class DeviceSlaveController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @EventPattern('master/+/slave/+/+/state', Transport.MQTT)
  async receiveSlaveState(@Payload() runtimeMinutes: number, @Ctx() context: MqttContext) {
    const [, mId, , sId, sensorName] = context.getTopic().split('/');
    const masterId = parseInt(mId);
    const slaveId = parseInt(sId);
    console.log(context.getTopic());
    console.log(context.getPacket());

    if (runtimeMinutes > 0) {
      const stateDto = new SlaveStateDto(masterId, slaveId, sensorName as Sensor);
      const key = stateDto.getRunningStateKey();

      const cachedResult = await this.cacheManager.set<string>(key, 'on', {
        ttl: runtimeMinutes * RedisTTL.MINUTE, // make minutes -> second
      });

      console.log(cachedResult);
    }
  }
}
