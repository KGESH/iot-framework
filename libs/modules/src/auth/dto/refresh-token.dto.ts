import { IsObject, IsString } from 'class-validator';
import { AuthUserDto } from './auth-user.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @Expose()
  @ApiProperty()
  @IsObject()
  user: AuthUserDto;

  @Expose()
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
