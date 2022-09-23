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

  async findMastersSlavesByUserId(userId: number): Promise<ResponseEntity<Master[]>> {
    const masters = await this.masterQueryRepository.findMastersWithSlavesByUserId(userId);
    return ResponseEntity.OK_WITH(masters);
  }

  async deleteMaster(masterId: number) {
    const deleteResult = await this.masterRepository.deleteByMasterId(masterId);

    if (notAffected(deleteResult)) {
      return ResponseEntity.ERROR_WITH('Master delete not affected!', HttpStatus.BAD_REQUEST);
    }

    return ResponseEntity.OK();
  }
}
