import { IsEnum, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EPowerState, ESensor } from '@iot-framework/utils';

export class SensorPowerDto {
  @ApiProperty()
  @IsNumber()
  readonly masterId: number;

  @ApiProperty()
  @IsNumber()
  readonly slaveId: number;

  @ApiProperty({ enum: EPowerState })
  @IsEnum(EPowerState)
  @IsIn(['on', 'off'], {
    message: `'powerState' is not 'on' or 'off'`,
  })
  readonly powerState: EPowerState;

  @ApiProperty({ enum: ESensor })
  @IsEnum(ESensor)
  readonly sensor: ESensor;
}
