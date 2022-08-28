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
import { ISlaveConfigs } from '@iot-framework/entities';
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
  async createSlave(@Body() createSlaveDto: CreateSlaveDto) {
    const createResult = await this.slaveService.createSlave(createSlaveDto);
    if (!createResult) {
      throw new NotFoundException('Slave Create Error');
    }

    return createResult;
  }

  @Delete()
  async deleteSlave(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ) {
    return this.slaveService.deleteSlave(masterId, slaveId);
  }

  @Get('config')
  async fetchConfig(
    @Query('masterId') masterId: number,
    @Query('slaveId') slaveId: number
  ): Promise<ResponseEntity<ISlaveConfigs>> {
    return this.slaveService.getConfigs(masterId, slaveId);
  }

  /** Todo: 센서들 상태 캐싱값 받아와서 돌려줌 */
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
