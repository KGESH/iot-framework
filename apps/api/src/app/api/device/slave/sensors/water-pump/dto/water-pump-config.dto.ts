import { PickType } from '@nestjs/swagger';
import { SensorsConfigDto } from '@iot-framework/entities';

export class WaterPumpConfigDto extends PickType(SensorsConfigDto, [
  'masterId',
  'slaveId',
  'waterPumpCycle',
  'waterPumpRuntime',
] as const) {}
