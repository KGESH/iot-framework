import { Body, Controller, Get, Delete, Headers, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiMasterService } from '../master/api-master.service';
import { ApiSlaveService } from './api-slave.service';
import { SWAGGER_TAG } from '../../../../utils/swagger/enum';
import { JwtAuthGuard, ResponseEntity, RolesGuard } from '@iot-framework/modules';
import { Slave, SlaveConfigsResponse, UserRoles } from '@iot-framework/entities';
import { CreateSlaveDto } from './dto/create-slave.dto';

@ApiTags(SWAGGER_TAG.SLAVE)
@ApiBearerAuth()
@Controller('device/slave')
export class ApiSlaveController {
  constructor(private masterService: ApiMasterService, private slaveService: ApiSlaveService) {}

  @Post()
  @ApiCreatedResponse({ type: ResponseEntity })
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async createSlave(@Body() createSlaveDto: CreateSlaveDto): Promise<ResponseEntity<Slave>> {
    return this.slaveService.createSlave(createSlaveDto);
  }

  @Delete()
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(JwtAuthGuard)
  async deleteSlave(@Query('master_id') masterId: number, @Query('slave_id') slaveId: number) {
    return this.slaveService.deleteSlave(masterId, slaveId);
  }

  @Get('state')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async getSensorsState(@Query('master_id') masterId: number, @Query('slave_id') slaveId: number) {
    return this.slaveService.getSlaveState(masterId, slaveId);
  }

  @Get('config')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async fetchConfig(
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ): Promise<ResponseEntity<SlaveConfigsResponse>> {
    return this.slaveService.getSlaveConfigs(masterId, slaveId);
  }
}
