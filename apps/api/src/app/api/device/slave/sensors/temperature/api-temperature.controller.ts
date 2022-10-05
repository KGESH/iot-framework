import { Body, Controller, Delete, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTemperatureService } from './api-temperature.service';
import { ResponseEntity } from '@iot-framework/modules';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../../../../../utils/swagger/enum';
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
    try {
      await this.apiTemperatureService.createMockTemperatures(mockDto);
      return ResponseEntity.OK();
    } catch (e) {
      return ResponseEntity.ERROR_WITH(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('mock')
  async deleteMockTemperatures(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ) {
    try {
      await this.apiTemperatureService.deleteMockTemperatures(masterId, slaveId);
    } catch (e) {
      console.log(e);
    }
  }
}
