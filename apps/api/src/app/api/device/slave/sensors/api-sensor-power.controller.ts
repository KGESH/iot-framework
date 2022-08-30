import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../utils/swagger/enum';
import { ApiSensorPowerService } from './api-sensor-power.service';
import { SensorPowerDto } from './dto/sensor-power.dto';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';

@ApiTags(SWAGGER_TAG.SENSOR)
@ApiBearerAuth()
@UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
@UseGuards(JwtAuthGuard)
@Controller('device/sensor')
export class ApiSensorPowerController {
  constructor(private readonly apiSensorPowerService: ApiSensorPowerService) {}

  @Post('power')
  async turnPower(@Body() slavePowerDto: SensorPowerDto): Promise<unknown> {
    return this.apiSensorPowerService.turnPower(slavePowerDto);
  }
}
