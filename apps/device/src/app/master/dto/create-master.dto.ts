import { PickType } from '@nestjs/swagger';
import { Master } from '@iot-framework/entities';
import { IsNumber } from 'class-validator';

/** Todo: Extract to Libs */
export class CreateMasterDto extends PickType(Master, [
  'masterId',
  'address',
] as const) {
  @IsNumber()
  userId: number;
}
