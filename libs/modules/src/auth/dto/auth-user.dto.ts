import { User } from 'libs/entities/src/domain/user/user.entity';

import { PickType } from '@nestjs/swagger';

export class AuthUserDto extends PickType(User, ['id', 'username', 'email', 'role'] as const) {}
