import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SlaveConfigDto {
  @ApiProperty()
  @IsNumber()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  slaveId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  rangeBegin: number;

  @ApiProperty()
  @IsNumber()
  @Max(100)
  rangeEnd: number;

  @ApiProperty()
  @IsNumber()
  updateCycle: number;

  @ApiProperty()
  @IsNumber()
  @Max(255)
  waterPumpCycle: number;

  @ApiProperty()
  @IsNumber()
  @Max(255)
  waterPumpRuntime: number;

  @ApiProperty()
  @IsNumber()
  @Max(255)
  ledCycle: number;

  @ApiProperty()
  @IsNumber()
  @Max(255)
  ledRuntime: number;
}
