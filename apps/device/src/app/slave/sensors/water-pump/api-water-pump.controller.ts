import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiWaterPumpService } from './api-water-pump.service';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { SlaveStateDto } from '../../dto/slave-state.dto';

@Controller('water')
export class ApiWaterPumpController {
  constructor(private readonly apiWaterPumpService: ApiWaterPumpService) {}

  @Post('power')
  async turnWaterPump(@Body() dto: SlaveStateDto) {
    try {
      await this.apiWaterPumpService.turnPower(dto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }

  @Post('config')
  async setWaterPumpConfig(
    @Body() waterPumpConfigDto: WaterPumpConfigDto
  ): Promise<ResponseEntity<null>> {
    try {
      await this.apiWaterPumpService.setConfig(waterPumpConfigDto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }
}
