import { IsEnum, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EPowerState,
  ESensor,
  SensorPowerKey,
  SensorStateKey,
} from '@iot-framework/utils';

export class SlaveCacheDto {
  @ApiProperty()
  @IsNumber()
  readonly masterId: number;

  @ApiProperty()
  @IsNumber()
  readonly slaveId: number;

  @ApiProperty()
  @IsEnum(EPowerState)
  @IsIn(['on', 'off'], {
    message: `'powerState' is not 'on' or 'off'`,
  })
  readonly powerState?: EPowerState;

  @ApiProperty()
  @IsEnum(ESensor)
  readonly sensor: ESensor;

  constructor(
    masterId: number,
    slaveId: number,
    sensor?: ESensor,
    powerState?: EPowerState
  ) {
    this.masterId = masterId;
    this.slaveId = slaveId;
    this.sensor = sensor;
    this.powerState = powerState;
  }

  getPowerKey() {
    return SensorPowerKey({
      sensor: this.sensor,
      masterId: this.masterId,
      slaveId: this.slaveId,
    });
  }

  getStateKey() {
    return SensorStateKey({
      sensor: this.sensor,
      masterId: this.masterId,
      slaveId: this.slaveId,
    });
  }
}
