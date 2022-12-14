import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiLedService } from './api-led.service';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';
import { LedConfigDto } from './dto/led-config.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../utils/swagger/enum';

@ApiTags(SWAGGER_TAG.LED)
@ApiBearerAuth()
@Controller('device/led')
export class ApiLedController {
  constructor(private readonly apiLedService: ApiLedService) {}

  @Post('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(JwtAuthGuard)
  async setLedConfig(@Body() ledConfigDto: LedConfigDto) {
    return this.apiLedService.setLedConfig(ledConfigDto);
  }
}
