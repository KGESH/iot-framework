import {
  Body,
  HttpStatus,
  CACHE_MANAGER,
  Controller,
  Get,
  Delete,
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
  async createSlave(
    @Body() createSlaveDto: CreateSlaveDto
  ): Promise<ResponseEntity<null>> {
    return await this.slaveService.createSlave(createSlaveDto);
  }

  @Delete()
  async deleteSlave(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ResponseEntity<null>> {
    return this.slaveService.deleteSlave(masterId, slaveId);
  }

  @Get('config')
  async fetchConfig(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ResponseEntity<SlaveConfigsResponse>> {
    return this.slaveService.getConfigs(masterId, slaveId);
  }

  @Get('state')
  async getSlaveState(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ) {
    try {
      const slaveStateDto = new SlaveStateDto(masterId, slaveId);
      const sensorsState = await this.apiSlaveService.getSensorsState(
        slaveStateDto
      );

      return ResponseEntity.OK_WITH(sensorsState);
    } catch (e) {
      /** Todo: Logging */
      return ResponseEntity.ERROR_WITH_DATA(
        'Get slave state error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e
      );
    }
  }
}
