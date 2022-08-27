import { HttpStatus, Injectable } from '@nestjs/common';
import { MasterQueryRepository } from '@iot-framework/entities';
import { CreateMasterDto } from './dto/create-master.dto';
import { ResponseEntity } from '@iot-framework/modules';
import { DeviceMasterRepository } from './device-master.repository';

@Injectable()
export class DeviceMasterService {
  constructor(
    private readonly masterRepository: DeviceMasterRepository,
    private readonly masterQueryRepository: MasterQueryRepository
  ) {}

  async createMaster(
    createMasterDto: CreateMasterDto
  ): Promise<ResponseEntity<null>> {
    const { masterId } = createMasterDto;

    const exist = await this.masterQueryRepository.findOneByMasterId(masterId);
    if (exist) {
      /** Todo: handle exception */
      console.log(`Master ID Exist!`);
      return ResponseEntity.ERROR_WITH('Master exist!', HttpStatus.CONFLICT);
    }

    const createSuccess = await this.masterRepository.createMaster(
      createMasterDto
    );

    if (createSuccess) {
      return ResponseEntity.OK();
    }

    return ResponseEntity.ERROR_WITH(
      'Master create fail!',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async deleteMaster(masterId: number) {
    const deleteSuccess = await this.masterRepository.deleteByMasterId(
      masterId
    );

    if (deleteSuccess) {
      return ResponseEntity.OK();
    }

    return ResponseEntity.ERROR_WITH(
      'Master delete fail!',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
