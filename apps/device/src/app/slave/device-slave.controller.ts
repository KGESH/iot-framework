import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { SlaveStateDto } from './dto/slave-state.dto';
import { Sensor } from '@iot-framework/entities';
import { Cache } from 'cache-manager';

@Controller()
export class DeviceSlaveController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @EventPattern('master/+/slave/+/+/state', Transport.MQTT)
  async receiveSlaveState(@Payload() runtimeMinutes: number, @Ctx() context: MqttContext) {
    const [, mId, , sId, sensorName] = context.getTopic().split('/');
    const masterId = parseInt(mId);
    const slaveId = parseInt(sId);
    const sensor = `${sensorName}/state`; // 🤔
    /**
     * Todo: Extract Service & cleanup */
    /**
     * Todo: Cache Power State oxd1 */
    console.log(`slave info: `, masterId, slaveId, sensor);
    console.log(`salve runtime: `, runtimeMinutes);
    const stateDto = new SlaveStateDto(masterId, slaveId, sensor as Sensor);
    const key = stateDto.getRunningStateKey();
    console.log(`Mock key: `, key);

    if (runtimeMinutes > 0) {
      await this.cacheManager.set<string>(key, 'on', {
        ttl: runtimeMinutes * 60, // make minutes -> second
      });
    }

    console.log(`receive slave state packet: `, context.getPacket());
  }
}
