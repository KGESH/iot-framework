import {
  Body,
  HttpStatus,
  CACHE_MANAGER,
  Controller,
  Get,
  Delete,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiSlaveService } from './api-slave.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from '../../utils/swagger/enum';
import { SlaveConfigsResponse } from '@iot-framework/entities';
import { DeviceSlaveService } from './device-slave.service';
import { ResponseEntity } from '@iot-framework/modules';

@ApiTags(SWAGGER_TAG.SLAVE)
@Controller('slave')
export class ApiSlaveController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly slaveService: DeviceSlaveService,
    private readonly apiSlaveService: ApiSlaveService
  ) {}

  @Post()
  async createSlave(@Body() createSlaveDto: CreateSlaveDto): Promise<ResponseEntity<null>> {
    try {
      await this.slaveService.createSlave(createSlaveDto);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }

  @Delete()
  async deleteSlave(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ResponseEntity<null>> {
    try {
      await this.slaveService.deleteSlave(masterId, slaveId);
      return ResponseEntity.OK();
    } catch (e) {
      return e;
    }
  }

  @Get('config')
  async fetchConfig(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ResponseEntity<SlaveConfigsResponse>> {
    try {
      const fetched = await this.slaveService.getConfigs(masterId, slaveId);
      return ResponseEntity.OK_WITH(fetched);
    } catch (e) {
      return e;
    }
  }

  @Get('state')
  async getSlaveState(@Query('masterId') masterId: number, @Query('slaveId') slaveId: number) {
    try {
      const sensorsState = await this.apiSlaveService.getSensorsState(masterId, slaveId);
      return ResponseEntity.OK_WITH(sensorsState);
    } catch (e) {
      return ResponseEntity.ERROR_WITH_DATA(
        'Get slave state error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e
      );
    }
  }
}
