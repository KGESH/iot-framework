import { Injectable } from '@nestjs/common';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveStateDto } from './dto/slave-state.dto';
import { ApiMasterService } from '../master/api-master.service';
import { DeviceClientService } from '@iot-framework/modules';

@Injectable()
export class ApiSlaveService {
  constructor(
    private readonly deviceMicroservice: ApiMasterService, // private readonly httpService: HttpService
    private readonly deviceClientService: DeviceClientService
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto) {
    return this.deviceClientService.post('slave', createSlaveDto);
    // return lastValueFrom(
    //   this.httpService.post(
    //     this.deviceMicroservice.requestUrl('slave'),
    //     createSlaveDto
    //   )
    // );
  }

  async getSlaveConfigs(masterId: number, slaveId: number) {
    return this.deviceClientService.get('slave/config', {
      params: { masterId, slaveId },
    });
    // return lastValueFrom(
    //   this.httpService.get(this.deviceMicroservice.requestUrl('slave/config'), {
    //     params: { masterId, slaveId },
    //   })
    // );
  }

  async getSlaveState(slaveStateDto: SlaveStateDto) {
    return this.deviceClientService.post('slave/state', slaveStateDto);
    // return lastValueFrom(
    //   this.httpService.post(
    //     this.deviceMicroservice.requestUrl('slave/state'),
    //     slaveStateDto
    //   )
    // );
  }
}
