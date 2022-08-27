import { IsEnum } from 'class-validator';
import { EPowerState } from '@iot-framework/utils';

export class SensorStateDto {
  @IsEnum(EPowerState)
  waterPumpRunningState: EPowerState;

  @IsEnum(EPowerState)
  waterPumpPowerState: EPowerState;

  @IsEnum(EPowerState)
  ledRunningState: EPowerState;

  @IsEnum(EPowerState)
  ledPowerState: EPowerState;

  @IsEnum(EPowerState)
  fanRunningState: EPowerState;

  @IsEnum(EPowerState)
  fanPowerState: EPowerState;
}
