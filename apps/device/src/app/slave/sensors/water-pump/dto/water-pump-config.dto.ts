import { PickType } from '@nestjs/swagger';
import { SlaveConfigDto } from '../../../dto/slave-config.dto';

export class WaterPumpConfigDto extends PickType(SlaveConfigDto, [
  'masterId',
  'slaveId',
  'waterPumpCycle',
  'waterPumpRuntime',
] as const) {}
