import { DeviceClientService } from '@iot-framework/modules';
import { Injectable } from '@nestjs/common';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';

@Injectable()
export class ApiThermometerService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async setThermometerConfig(dto: ThermometerConfigDto) {
    return this.deviceClientService.post('thermometer/config', dto);
  }
}
