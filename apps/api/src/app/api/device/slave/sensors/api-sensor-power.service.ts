import { Injectable } from '@nestjs/common';
import { DeviceClientService } from '@iot-framework/modules';
import { SensorPowerDto } from './dto/sensor-power.dto';

@Injectable()
export class ApiSensorPowerService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async turnPower(slavePowerDto: SensorPowerDto): Promise<unknown> {
    return this.deviceClientService.post(`${slavePowerDto.sensor}/power`, slavePowerDto);
  }
}
