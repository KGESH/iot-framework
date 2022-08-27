import { Injectable } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { ISecretService } from '@iot-framework/core';
import { AuthUserDto, DeviceClientService } from '@iot-framework/modules';

@Injectable()
export class ApiMasterService {
  constructor(
    private readonly secretService: ISecretService,
    private readonly deviceClientService: DeviceClientService
  ) {}

  async createMaster(
    createMasterDto: CreateMasterDto,
    authUserDto: AuthUserDto
  ) {
    const dto = createMasterDto;
    dto.userId = authUserDto.id; // 🤔

    return this.deviceClientService.post('master', {
      ...dto,
    });
  }

  async getMasterState(masterId: number) {
    return this.deviceClientService.get('master/polling', {
      params: {
        masterId,
      },
    });
  }
}
