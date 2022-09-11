import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'Example@google.com',
    description: 'User unique email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'example', description: 'User password' })
  @IsString()
  password: string;
}
