import { IsObject, IsString } from 'class-validator';
import { AuthUserDto } from './auth-user.dto';

export class TokensDto {
  @IsObject()
  user: AuthUserDto;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
