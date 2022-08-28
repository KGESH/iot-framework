import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { DeviceThermometerService } from './device-thermometer.service';
import { ResponseEntity } from '@iot-framework/modules';

@Controller('thermometer')
export class ApiThermometerController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly deviceThermometerService: DeviceThermometerService
  ) {}

  @Post('config')
  async setThermometerConfig(
    @Body() thermometerConfigDto: ThermometerConfigDto
  ): Promise<ResponseEntity<null>> {
    return this.deviceThermometerService.setConfig(thermometerConfigDto);
  }
}
