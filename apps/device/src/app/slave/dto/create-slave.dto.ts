import { PickType } from '@nestjs/swagger';
import { Slave } from '@iot-framework/entities';

export class CreateSlaveDto extends PickType(Slave, [
  'masterId',
  'slaveId',
] as const) {}
