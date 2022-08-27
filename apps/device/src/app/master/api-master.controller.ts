import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { SWAGGER_TAG } from '../../utils/swagger/enum';
import { DeviceMasterService } from './device-master.service';
import { ApiTags } from '@nestjs/swagger';
import { DevicePollingService } from './device-polling.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { EPollingState } from './types/polling.enum';
import { ResponseEntity } from '@iot-framework/modules';

@ApiTags(SWAGGER_TAG.MASTER)
@Controller('master')
export class ApiMasterController {
  constructor(
    private readonly masterService: DeviceMasterService,
    private readonly pollingService: DevicePollingService
  ) {}

  @Post()
  async createMaster(@Body() createMasterDto: CreateMasterDto) {
    return await this.masterService.createMaster(createMasterDto);
  }

  /**
   * Todo: refactor to better status code */
  @Get('polling')
  async getPollingState(@Query('masterId') masterId: number) {
    const pollingState = await this.pollingService.getPollingState(masterId);

    switch (pollingState) {
      case EPollingState.OK:
        return ResponseEntity.OK();

      case EPollingState.ERROR1:
        return ResponseEntity.ERROR_WITH(
          `Mock Polling State Error ID:${masterId}`,
          HttpStatus.NOT_FOUND
        );

      default:
        return ResponseEntity.ERROR_WITH(
          `Mock Polling State Error ID:${masterId}`,
          HttpStatus.NOT_FOUND
        );
    }
  }
}