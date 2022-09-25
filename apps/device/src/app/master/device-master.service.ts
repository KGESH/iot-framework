import { HttpStatus, Injectable } from '@nestjs/common';
import { Master, MasterQueryRepository } from '@iot-framework/entities';
import { CreateMasterDto } from './dto/create-master.dto';
import { notAffected, ResponseEntity } from '@iot-framework/modules';
import { DeviceMasterRepository } from './device-master.repository';

@Injectable()
export class DeviceMasterService {
  constructor(
    private readonly masterRepository: DeviceMasterRepository,
    private readonly masterQueryRepository: MasterQueryRepository
  ) {}

  async createMaster(createMasterDto: CreateMasterDto): Promise<ResponseEntity<null>> {
    const { masterId } = createMasterDto;

    const exist = await this.masterQueryRepository.findOneByMasterId(masterId);
    if (exist) {
      return ResponseEntity.ERROR_WITH('Master exist!', HttpStatus.BAD_REQUEST);
    }

    await this.masterRepository.createMaster(createMasterDto);
    return ResponseEntity.OK();
  }

  /** Frontend business logic */
  async findMastersSlavesByUserId(
    userId: number
  ): Promise<ResponseEntity<{ masterId: number; slaves: number[] }[]>> {
    const masters = await this.masterQueryRepository.findMastersWithSlavesByUserId(userId);
    const masterIdsWithSlaveIds = masters.map((master) => {
      const slaveIds = master.slaves.map((slave) => slave.id);
      return { masterId: master.id, slaves: slaveIds };
    });

    return ResponseEntity.OK_WITH(masterIdsWithSlaveIds);
  }

  async deleteMaster(masterId: number) {
    const deleteResult = await this.masterRepository.deleteByMasterId(masterId);

    if (notAffected(deleteResult)) {
      return ResponseEntity.ERROR_WITH('Master delete not affected!', HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.OK();
  }
}
