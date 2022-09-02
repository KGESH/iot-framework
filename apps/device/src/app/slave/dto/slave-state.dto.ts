import { IsEnum, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EPowerState, SensorPowerKey, SensorRunningStateKey } from '@iot-framework/utils';
import { Sensor } from '@iot-framework/entities';

export class SlaveStateDto {
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
  @IsEnum(Sensor)
  readonly sensor: Sensor;

  constructor(masterId: number, slaveId: number, sensor: Sensor, powerState?: EPowerState) {
    this.masterId = masterId;
    this.slaveId = slaveId;
    this.sensor = sensor;
    this.powerState = powerState;
  }

  getPowerKey(): string {
    return SensorPowerKey({
      sensor: this.sensor,
      masterId: this.masterId,
      slaveId: this.slaveId,
    });
  }

  getRunningStateKey(): string {
    return SensorRunningStateKey({
      sensor: this.sensor,
      masterId: this.masterId,
      slaveId: this.slaveId,
    });
  }
}
