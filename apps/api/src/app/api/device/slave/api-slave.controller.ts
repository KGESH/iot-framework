import {
  Body,
  Controller,
  Get,
  Delete,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMasterService } from '../master/api-master.service';
import { ApiSlaveService } from './api-slave.service';
import { SWAGGER_TAG } from '../../../../utils/swagger/enum';
import { JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';
import { CreateSlaveDto } from './dto/create-slave.dto';

@ApiTags(SWAGGER_TAG.SLAVE)
@ApiBearerAuth()
@Controller('device/slave')
export class ApiSlaveController {
  constructor(
    private masterService: ApiMasterService,
    private slaveService: ApiSlaveService
  ) {}

  @Post()
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async createSlave(@Body() createSlaveDto: CreateSlaveDto) {
    try {
      console.log(`Call Slave Create`);
      const data = await this.slaveService.createSlave(createSlaveDto);
      console.log(`Get result: `, data);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  @Delete()
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(JwtAuthGuard)
  async deleteSlave(
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    return this.slaveService.deleteSlave(masterId, slaveId);
  }

  @Get('state')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async getSensorsState(
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    return this.slaveService.getSlaveState(masterId, slaveId);
  }

  @Get('config')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async fetchConfig(
    @Headers() header: any,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    return this.slaveService.getSlaveConfigs(masterId, slaveId);
  }
}
