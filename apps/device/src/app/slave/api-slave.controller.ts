import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SlaveStateDto } from './dto/slave-state.dto';
import { ApiSlaveService } from './api-slave.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../utils/swagger/enum';
import { DevicePollingService } from '../master/device-polling.service';
import { ISlaveConfigs } from './types/slave-config';
import { DeviceSlaveService } from './device-slave.service';

@ApiTags(SWAGGER_TAG.SLAVE)
@Controller('slave')
export class ApiSlaveController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly slaveService: DeviceSlaveService,
    private readonly pollingService: DevicePollingService,
    private readonly apiSlaveService: ApiSlaveService
  ) {}

  @Post()
  async createSlave(@Body() createSlaveDto: CreateSlaveDto) {
    const createResult = await this.slaveService.createSlave(createSlaveDto);
    if (!createResult) {
      throw new NotFoundException('Slave Create Error');
    }

    return createResult;
  }

  @Get('config')
  async fetchConfig(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ISlaveConfigs> {
    try {
      return this.slaveService.getConfigs(masterId, slaveId);
    } catch (e) {
      console.log(e);
    }
  }

  /** Todo: 센서들 상태 캐싱값 받아와서 돌려줌 */
  @Post('state')
  async getSlaveState(@Body() slaveStateDto: SlaveStateDto) {
    try {
      /* TODO: Validate master id & slave id */

      const sensorStates = await this.apiSlaveService.getSensorsState(
        slaveStateDto
      );

      return sensorStates;
    } catch (e) {
      console.log(e);
    }
  }
}
