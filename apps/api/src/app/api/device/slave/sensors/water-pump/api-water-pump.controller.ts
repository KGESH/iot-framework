import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiWaterPumpService } from './api-water-pump.service';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../utils/swagger/enum';

@ApiTags(SWAGGER_TAG.WATER_PUMP)
@ApiBearerAuth()
@Controller('device/water')
export class ApiWaterPumpController {
  constructor(private readonly apiWaterPumpService: ApiWaterPumpService) {}

  @Post('config')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async setWaterPumpConfig(@Body() waterPumpDto: WaterPumpConfigDto) {
    console.log(`Call API: `, waterPumpDto);
    return this.apiWaterPumpService.setWaterPumpConfig(waterPumpDto);
  }
}
