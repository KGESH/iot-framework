import { PickType } from '@nestjs/swagger';
import { SensorsConfigDto } from '@iot-framework/entities';

export class LedConfigDto extends PickType(SensorsConfigDto, [
  'masterId',
  'slaveId',
  'ledCycle',
  'ledRuntime',
] as const) {}
