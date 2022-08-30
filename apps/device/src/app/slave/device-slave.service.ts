import { HttpStatus, Injectable } from '@nestjs/common';
import {
  MasterQueryRepository,
  SlaveConfigsResponse,
  SlaveQueryRepository,
} from '@iot-framework/entities';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { notAffected, ResponseEntity } from '@iot-framework/modules';
import { SlaveRepository } from './device-slave.repository';

@Injectable()
export class DeviceSlaveService {
  constructor(
    private readonly masterQueryRepository: MasterQueryRepository,
    private readonly slaveRepository: SlaveRepository,
    private readonly slaveQueryRepository: SlaveQueryRepository
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto): Promise<void> {
    const { masterId, slaveId } = createSlaveDto;

    const master = await this.masterQueryRepository.findOneByMasterId(masterId);
    if (!master) {
      throw ResponseEntity.ERROR_WITH(`Master Not Found!`, HttpStatus.BAD_REQUEST);
    }

    const slaveExist = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);
    if (slaveExist) {
      throw ResponseEntity.ERROR_WITH('Slave already exist!', HttpStatus.BAD_REQUEST);
    }

    await this.slaveRepository.createSlave(master, slaveId);
  }

  async deleteSlave(masterId: number, slaveId: number): Promise<void> {
    const isExist = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);

    if (!isExist) {
      throw ResponseEntity.ERROR_WITH('Slave is not exist!', HttpStatus.BAD_REQUEST);
    }

    const deleteResult = await this.slaveRepository.deleteSlave(masterId, slaveId);
    if (notAffected(deleteResult)) {
      throw ResponseEntity.ERROR_WITH('Slave delete not affected!', HttpStatus.BAD_REQUEST);
    }
  }

  async getConfigs(masterId: number, slaveId: number): Promise<SlaveConfigsResponse> {
    const fetched = await this.slaveQueryRepository.getConfigs(masterId, slaveId);
    if (!fetched) {
      throw ResponseEntity.ERROR_WITH('Slave configs not found!', HttpStatus.BAD_REQUEST);
    }

    return fetched;
  }
}
