import { Body, Controller, Post } from '@nestjs/common';
import { ApiFanService } from './api-fan.service';
import { SlaveStateDto } from '../../../dto/slave-state.dto';
import { ResponseEntity } from '@iot-framework/modules';

@Controller('fan')
export class ApiFanController {
  constructor(private readonly apiFanService: ApiFanService) {}

  @Post('power')
  async turnPower(@Body() dto: SlaveStateDto) {
    try {
      await this.apiFanService.turnPower(dto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }
}
