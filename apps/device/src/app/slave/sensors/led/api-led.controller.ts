import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiLedService } from './api-led.service';
import { LedConfigDto } from './dto/led-config.dto';

@Controller('led')
export class ApiLedController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiLedService: ApiLedService
  ) {}

  @Post('config')
  async setLedConfig(
    @Body() ledConfigDto: LedConfigDto
  ): Promise<ResponseEntity<null>> {
    return this.apiLedService.setConfig(ledConfigDto);
  }

  // @Post('power')
  // async turnLed(@Body() dto: SlaveCacheDto) {
  //   return this.apiLedService.turnPower(dto);
  // }
}
