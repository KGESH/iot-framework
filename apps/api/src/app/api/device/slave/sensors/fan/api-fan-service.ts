import { Injectable } from '@nestjs/common';
import { DeviceClientService } from '@iot-framework/modules';
import { SlavePowerDto } from '../../dto/slave-power.dto';

@Injectable()
export class ApiFanService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async turnFan(dto: SlavePowerDto): Promise<unknown> {
    return this.deviceClientService.post('fan/power', dto);
  }
}
