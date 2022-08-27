import { PickType } from '@nestjs/swagger';
import { User } from '@iot-framework/entities';

export class AuthUserDto extends PickType(User, [
  'id',
  'username',
  'email',
  'role',
] as const) {}
