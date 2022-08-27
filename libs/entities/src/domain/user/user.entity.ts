import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from './types/user-role.enum';
import { genSalt, hash } from 'bcrypt';
import { EBcrypt } from './types/bcrypt.enum';
import { BaseTimeEntity } from '../base-time.entity';
import { Master } from '@iot-framework/entities';

@Entity({ name: 'users' })
export class User extends BaseTimeEntity {
  @ApiProperty({ example: 1234, description: 'User id' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Example@google.com',
    description: 'User unique email',
  })
  @Index({ unique: true })
  @Column({ name: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'example', description: 'User password' })
  @Column({ name: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'example', description: 'User name' })
  @Column({ name: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: '010-1234-5678', description: 'User phone number' })
  @Column({ unique: true, name: 'phone_number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'admin', description: 'User Auth Role' })
  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.GUEST,
    name: 'role',
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty({ example: Master, description: `User's master board` })
  @OneToMany((type) => Master, (master) => master.id)
  masters: Master[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt(EBcrypt.HASH_ROUNDS);
    this.password = await hash(this.password, salt);
  }
}
