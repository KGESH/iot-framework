import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '@iot-framework/entities';
import { ApiMasterService } from './api-master.service';
import { AuthUserDto, JwtAuthGuard, RolesGuard } from '@iot-framework/modules';
import { AuthUser } from '../../auth/decoratos/auth-user.decorator';
import { SWAGGER_TAG } from '../../../../utils/swagger/enum';

@ApiTags(SWAGGER_TAG.MASTER)
@ApiBearerAuth()
@Controller('api/device-service/master')
export class ApiMasterController {
  constructor(private readonly masterService: ApiMasterService) {}

  @Post()
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async createMaster(
    @AuthUser() authUser: AuthUserDto,
    @Body() createMasterDto: CreateMasterDto
  ) {
    return this.masterService.createMaster(createMasterDto, authUser);
  }

  @Get('state')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(JwtAuthGuard)
  async getMasterState(@Query('master_id') masterId: number) {
    return this.masterService.getMasterState(masterId);
  }
}
