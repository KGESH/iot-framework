import { PickType } from '@nestjs/swagger';
import { User } from '@iot-framework/entities';

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
