import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTemperatureService } from './api-temperature.service';
import { JwtAuthGuard, ResponseEntity, RolesGuard } from '@iot-framework/modules';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../utils/swagger/enum';
import { UserRoles } from '@iot-framework/entities';
import { TemperatureBetweenDto } from '@iot-framework/entities';

@ApiTags(SWAGGER_TAG.THERMOMETER)
// @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('device/temperature')
export class ApiTemperatureController {
  constructor(private readonly apiTemperatureService: ApiTemperatureService) {}

  @Get('now')
  async getCurrentTemperature(
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ): Promise<ResponseEntity<number>> {
    return this.apiTemperatureService.getCachedTemperature(masterId, slaveId);
  }

  @Post('points')
  async getAveragePoints(@Body() temperatureBetweenDto: TemperatureBetweenDto) {
    return this.apiTemperatureService.getAveragePoints(temperatureBetweenDto);
  }

  @Post('between')
  async getTemperatures(@Body() temperatureBetweenDto: TemperatureBetweenDto) {
    return this.apiTemperatureService.getTemperatures(temperatureBetweenDto);
  }

  @Post('mock')
  async createMockTemperatures(@Body() mockDto: TemperatureBetweenDto) {
    return this.apiTemperatureService.createMockTemperatures(mockDto);
  }
}
