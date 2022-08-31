import { PickType } from '@nestjs/swagger';
import { SensorsConfigDto } from '@iot-framework/entities';

export class ThermometerConfigDto extends PickType(SensorsConfigDto, [
  'masterId',
  'slaveId',
  'rangeBegin',
  'rangeEnd',
  'updateCycle',
] as const) {}
