import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
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
  async createMock(@Body() mockDto: TemperatureBetweenDto) {
    const { masterId, slaveId, begin, end } = mockDto;
    await this.temperatureRepository.createMockData(masterId, slaveId, begin, end);
  }

  @Delete('mock')
  async deleteMock(@Query('masterId') masterId: number, @Query('slaveId') slaveId: number) {
    const deleteResult = await this.temperatureRepository.deleteMockData(masterId, slaveId);

    console.log(`delte result:`, deleteResult);
    return deleteResult;
  }
}
