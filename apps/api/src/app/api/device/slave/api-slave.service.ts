import { Injectable } from '@nestjs/common';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { ApiMasterService } from '../master/api-master.service';
import { DeviceClientService, ResponseEntity } from '@iot-framework/modules';
import { Slave, SlaveConfigsResponse } from '@iot-framework/entities';

@Injectable()
export class ApiSlaveService {
  constructor(
    private readonly deviceMicroservice: ApiMasterService, // private readonly httpService: HttpService
    private readonly deviceClientService: DeviceClientService
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto): Promise<ResponseEntity<Slave>> {
    return this.deviceClientService.post<ResponseEntity<Slave>>('slave', { ...createSlaveDto });
  }

  async deleteSlave(masterId: number, slaveId: number) {
    return this.deviceClientService.delete('slave', {
      params: { masterId, slaveId },
    });
  }

  async getSlaveConfigs(
    masterId: number,
    slaveId: number
  ): Promise<ResponseEntity<SlaveConfigsResponse>> {
    return this.deviceClientService.get<ResponseEntity<SlaveConfigsResponse>>('slave/config', {
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
