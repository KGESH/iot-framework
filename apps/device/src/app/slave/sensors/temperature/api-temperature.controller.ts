import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTemperatureService } from './api-temperature.service';
import { TemperatureBetweenDto } from '@iot-framework/entities';
import { TemperatureRepository } from './temperature.repository';

@Controller('temperature')
export class ApiTemperatureController {
  constructor(
    private readonly apiTemperatureService: ApiTemperatureService,
    private readonly temperatureRepository: TemperatureRepository
  ) {}

  @Get('now')
  async getCurrentTemperature(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ) {
    try {
      return await this.apiTemperatureService.getCurrentTemperature(masterId, slaveId);
    } catch (e) {
      return e;
    }
  }

  @Post('points')
  async getAveragePoints(@Body() temperatureBetweenDto: TemperatureBetweenDto) {
    try {
      return await this.apiTemperatureService.getAveragePoints(temperatureBetweenDto);
    } catch (e) {
      return e;
    }
  }

  @Post('between')
  async fetchTemperatures(@Body() temperatureBetweenDto: TemperatureBetweenDto) {
    try {
      return await this.apiTemperatureService.getTemperatures(temperatureBetweenDto);
    } catch (e) {
      return e;
    }
  }

  @Post('mock')
  async createMock(@Query('begin') begin: Date, @Query('end') end: Date) {
    await this.temperatureRepository.createMockData(1, begin, end);
  }
}
