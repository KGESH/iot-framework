import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Thermometer } from '@iot-framework/entities';
import { ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class ThermometerQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOneBySlaveFK(slaveFK: number): Promise<Thermometer> {
    const thermometer = await this.dataSource.getRepository(Thermometer).findOneBy({ slaveFK });
    if (!thermometer) {
      throw ResponseEntity.ERROR_WITH('Thermometer not found!', HttpStatus.BAD_REQUEST);
    }

    return thermometer;
  }
}
