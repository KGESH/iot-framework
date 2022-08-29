import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SlaveStateDto {
  @ApiProperty()
  @IsNumber()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  slaveId: number;

  constructor(masterId: number, slaveId: number) {
    this.masterId = masterId;
    this.slaveId = slaveId;
  }
}
