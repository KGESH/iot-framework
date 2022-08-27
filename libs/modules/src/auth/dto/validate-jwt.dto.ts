import { IsNumber, IsObject, IsString } from 'class-validator';
import { AuthUserDto } from './auth-user.dto';

export class ValidateJwtDto {
  @IsObject()
  user: AuthUserDto;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
