import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMasterService } from '../master/api-master.service';
import { ApiSlaveService } from './api-slave.service';
import { AuthGuard } from '@nestjs/passport';
import { SWAGGER_TAG } from '../../../../utils/swagger/enum';
import { RolesGuard } from '@iot-framework/modules';
import { UserRoles } from '@iot-framework/entities';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveStateDto } from './dto/slave-state.dto';

@ApiTags(SWAGGER_TAG.SLAVE)
@ApiBearerAuth('access-token')
@Controller('api/device-service/slave')
export class ApiSlaveController {
  constructor(
    private masterService: ApiMasterService,
    private slaveService: ApiSlaveService
  ) {}

  @Post()
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async createSlave(
    @Headers() header: any,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    try {
      const data = await this.slaveService.createSlave(
        new CreateSlaveDto(masterId, slaveId)
      );

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  @Get('state')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getSensorsState(
    @Headers() header: any,
    // @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }
    try {
      const data = await this.slaveService.getSlaveState(
        new SlaveStateDto(masterId, slaveId)
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  @Get('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async fetchConfig(
    @Headers() header: any,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number
  ) {
    try {
      const data = await this.slaveService.getSlaveConfigs(masterId, slaveId);

      /** Todo: refactor */
      //
      // const result: ResponseStatus = {
      //   status: HttpStatus.OK,
      //   topic: `configs`,
      //   message: `success get slave configs`,
      //   data,
      // };
      //

      return data;
    } catch (e) {
      console.log(e);
    }
  }
  //
  // @Delete('db')
  // async clearSlaveDB(@Res() res: Response) {
  //   try {
  //     const { data } = await this.slaveService.clearSlaveDB();
  //
  //     return res.send({
  //       statusCode: HttpStatus.OK,
  //       message: 'db clear completed',
  //       data,
  //     });
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
