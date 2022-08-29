import { HttpStatus, Injectable } from '@nestjs/common';
import { MasterQueryRepository } from '@iot-framework/entities';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveConfigsResponse } from '@iot-framework/entities';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';
import { SlaveRepository } from './device-slave.repository';

@Injectable()
export class DeviceSlaveService {
  constructor(
    private readonly masterQueryRepository: MasterQueryRepository,
    private readonly slaveRepository: SlaveRepository,
    private readonly slaveQueryRepository: SlaveQueryRepository
  ) {}

  async createSlave(
    createSlaveDto: CreateSlaveDto
  ): Promise<ResponseEntity<null>> {
    const { masterId, slaveId } = createSlaveDto;

    const master = await this.masterQueryRepository.findOneByMasterId(masterId);
    if (!master) {
      return ResponseEntity.ERROR_WITH(
        `Master Not Found!`,
        HttpStatus.NOT_FOUND
      );
    }

    const slaveExist = await this.slaveQueryRepository.findOneByMasterSlaveIds(
      masterId,
      slaveId
    );

    if (slaveExist) {
      return ResponseEntity.ERROR_WITH(
        'Slave already exist!',
        HttpStatus.CONFLICT
      );
    }

    const saveSuccess = await this.slaveRepository.createSlave(master, slaveId);
    if (saveSuccess) {
      return ResponseEntity.OK();
    }

    return ResponseEntity.ERROR_WITH(
      `Slave Create Error!`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async deleteSlave(
    masterId: number,
    slaveId: number
  ): Promise<ResponseEntity<null>> {
    const isExist = await this.slaveQueryRepository.findOneByMasterSlaveIds(
      masterId,
      slaveId
    );

    if (!isExist) {
      return ResponseEntity.ERROR_WITH(
        'Slave is not exist!',
        HttpStatus.NOT_FOUND
      );
    }

    const deleteSuccess = await this.slaveRepository.deleteSlave(
      masterId,
      slaveId
    );
    if (deleteSuccess) {
      return ResponseEntity.OK();
    }

    return ResponseEntity.ERROR_WITH(
      'Slave delete fail!',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async getConfigs(
    masterId: number,
    slaveId: number
  ): Promise<ResponseEntity<SlaveConfigsResponse>> {
    const fetched = await this.slaveQueryRepository.getConfigs(
      masterId,
      slaveId
    );

    if (!fetched) {
      return ResponseEntity.ERROR_WITH(
        'Slave configs not found!',
        HttpStatus.NOT_FOUND
      );
    }

    return ResponseEntity.OK_WITH(fetched);
  }
}
