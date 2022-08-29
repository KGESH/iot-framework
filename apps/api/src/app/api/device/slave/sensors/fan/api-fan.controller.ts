import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiFanService } from './api-fan-service';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';
import { SlavePowerDto } from '../../dto/slave-power.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../utils/swagger/enum';

@ApiTags(SWAGGER_TAG.FAN)
@ApiBearerAuth()
@Controller('device/fan')
export class ApiFanController {
  constructor(private readonly apiFanService: ApiFanService) {}

  @Post('config/power')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async turnFan(@Body() dto: SlavePowerDto): Promise<unknown> {
    return this.apiFanService.turnFan(dto);
  }
}
