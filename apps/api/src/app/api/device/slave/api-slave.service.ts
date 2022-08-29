import { Injectable } from '@nestjs/common';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { ApiMasterService } from '../master/api-master.service';
import { DeviceClientService } from '@iot-framework/modules';

@Injectable()
export class ApiSlaveService {
  constructor(
    private readonly deviceMicroservice: ApiMasterService, // private readonly httpService: HttpService
    private readonly deviceClientService: DeviceClientService
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto) {
    return this.deviceClientService.post('slave', { ...createSlaveDto });
  }

  async deleteSlave(masterId: number, slaveId: number) {
    return this.deviceClientService.delete('slave', {
      params: { masterId, slaveId },
    });
  }

  async getSlaveConfigs(masterId: number, slaveId: number) {
    return this.deviceClientService.get('slave/config', {
      params: { masterId, slaveId },
    });
  }

  async getSlaveState(masterId: number, slaveId: number) {
    return this.deviceClientService.get('slave/state', {
      params: {
        masterId,
        slaveId,
      },
    });
  }
}
