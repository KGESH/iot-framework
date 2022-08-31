import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiLedService } from './api-led.service';
import { LedConfigDto } from './dto/led-config.dto';
import { SlaveStateDto } from '../../dto/slave-state.dto';

@Controller('led')
export class ApiLedController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiLedService: ApiLedService
  ) {}

  @Post('power')
  async turnLed(@Body() dto: SlaveStateDto) {
    try {
      await this.apiLedService.turnPower(dto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }

  @Post('config')
  async setLedConfig(@Body() ledConfigDto: LedConfigDto): Promise<ResponseEntity<null>> {
    try {
      await this.apiLedService.setConfig(ledConfigDto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }
}
