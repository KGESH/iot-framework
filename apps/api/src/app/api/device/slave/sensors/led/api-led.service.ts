import { Injectable } from '@nestjs/common';
import { DeviceClientService } from '@iot-framework/modules';
import { LedConfigDto } from './dto/led-config.dto';

@Injectable()
export class ApiLedService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async setLedConfig(dto: LedConfigDto) {
    return this.deviceClientService.post('led/config', dto);
  }
}
