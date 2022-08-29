import { Injectable } from '@nestjs/common';
import { DeviceClientService } from '@iot-framework/modules';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';

@Injectable()
export class ApiWaterPumpService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async setWaterPumpConfig(dto: WaterPumpConfigDto) {
    return this.deviceClientService.post('water/config', dto);
  }
}
