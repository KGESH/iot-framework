import { Body, Controller, Post } from '@nestjs/common';
import { ApiFanService } from './api-fan.service';
import { SlaveCacheDto } from '../../dto/slave-cache.dto';
import { ApiSlaveService } from '../../api-slave.service';
import { ResponseEntity } from '@iot-framework/modules';

@Controller('fan')
export class ApiFanController {
  constructor(
    private readonly apiSlaveService: ApiSlaveService,
    private readonly apiFanService: ApiFanService
  ) {}

  @Post('power')
  async turnFan(@Body() dto: SlaveCacheDto) {
    try {
      await this.apiFanService.turnPower(dto);

      await this.apiSlaveService.cachePowerState(dto);
      await this.apiSlaveService.cacheRunningState(dto, 0);
    } catch (e) {
      return e;
    }

    return ResponseEntity.OK();
  }
}
