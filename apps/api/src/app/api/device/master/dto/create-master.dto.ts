import { PickType } from '@nestjs/swagger';
import { Master } from '@iot-framework/entities';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateMasterDto extends PickType(Master, [
  'masterId',
  'address',
] as const) {
  @IsOptional()
  @IsNumber()
  userId?: number;
}
