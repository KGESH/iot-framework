import { User } from '@iot-framework/entities';
import { PickType } from '@nestjs/swagger';

export class AuthUserDto extends PickType(User, [
  'id',
  'username',
  'email',
  'role',
] as const) {}
