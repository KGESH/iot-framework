import { PartialType } from '@nestjs/mapped-types';
import { User } from '@iot-framework/entities';

export class UpdateUserDto extends PartialType(User) {}
