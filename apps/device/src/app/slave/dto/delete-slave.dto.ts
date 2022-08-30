import { PickType } from '@nestjs/swagger';
import { Slave } from '@iot-framework/entities';

export class DeleteSlaveDto extends PickType(Slave, [
  'masterId',
  'slaveId',
] as const) {}
