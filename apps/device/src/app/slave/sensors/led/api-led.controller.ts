import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiLedService } from './api-led.service';
import { LedConfigDto } from './dto/led-config.dto';
import { SlaveStateDto } from '../../dto/slave-state.dto';
import { ApiSlaveService } from '../../api-slave.service';

@Controller('led')
export class ApiLedController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiSlaveService: ApiSlaveService,
    private readonly apiLedService: ApiLedService
  ) {}

  @Post('power')
  async turnLed(@Body() dto: SlaveStateDto) {
    try {
      await this.apiLedService.turnPower(dto);

      await this.apiSlaveService.cachePowerState(dto);
      await this.apiSlaveService.cacheRunningState(dto, 0);
    } catch (e) {
      return e;
    }

    return ResponseEntity.OK();
  }

  @Post('config')
  async setLedConfig(@Body() ledConfigDto: LedConfigDto): Promise<ResponseEntity<null>> {
    try {
      return await this.apiLedService.setConfig(ledConfigDto);
    } catch (e) {
      return e;
    }
  }
}
