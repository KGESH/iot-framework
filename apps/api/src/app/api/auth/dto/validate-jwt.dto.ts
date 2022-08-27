import { IsNumber, IsObject } from 'class-validator';
import { AuthUserDto } from '../dto/auth-user.dto';

export class ValidateJwtDto {
  @IsObject()
  user: AuthUserDto;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
