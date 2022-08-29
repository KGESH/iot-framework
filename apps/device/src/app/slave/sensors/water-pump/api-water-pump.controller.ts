import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiWaterPumpService } from './api-water-pump.service';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';

@Controller('water')
export class ApiWaterPumpController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly apiWaterPumpService: ApiWaterPumpService
  ) {}

  @Post('config')
  async setThermometerConfig(
    @Body() waterPumpConfigDto: WaterPumpConfigDto
  ): Promise<ResponseEntity<null>> {
    console.log(`Call config`, waterPumpConfigDto);
    return this.apiWaterPumpService.setConfig(waterPumpConfigDto);
  }
}
