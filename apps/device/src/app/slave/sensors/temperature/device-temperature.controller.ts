import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { DeviceTemperatureService } from './device-temperature.service';

@Controller()
export class DeviceTemperatureController {
  constructor(private readonly deviceTemperatureService: DeviceTemperatureService) {}
  @EventPattern('master/+/slave/+/temperature', Transport.MQTT)
  async receiveTemperature(@Payload() temperature: number, @Ctx() context: MqttContext) {
    const [, mId, , sId] = context.getTopic().split('/');
    const masterId = parseInt(mId);
    const slaveId = parseInt(sId);

    await this.deviceTemperatureService.receiveTemperature(
      masterId,
      slaveId,
      temperature,
      new Date()
    );
  }
}
