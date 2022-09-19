import { UserRoles } from '@iot-framework/entities';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../../utils/swagger/enum';
import { ApiThermometerService } from './api-thermometer.service';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';

@ApiTags(SWAGGER_TAG.THERMOMETER)
@ApiBearerAuth()
@Controller('device/thermometer')
export class ApiThermometerController {
  constructor(private readonly apiThermometerService: ApiThermometerService) {}

  @Post('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(JwtAuthGuard)
  async setThermometerConfig(@Body() thermometerConfigDto: ThermometerConfigDto) {
    return this.apiThermometerService.setThermometerConfig(thermometerConfigDto);
  }
}
