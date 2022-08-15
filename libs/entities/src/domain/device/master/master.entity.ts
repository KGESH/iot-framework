import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave/slave.entity';

@Entity('masters')
export class Master extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty({ example: 1234, description: 'Master id' })
  @IsNumber()
  @Column({ unique: true, name: 'master_id' })
  masterId: number;

  @ApiProperty({ example: 'example', description: 'Example address' })
  @Column({ name: 'username' })
  @IsString()
  address: string;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  @IsDate()
  createAt: Date;

  @OneToMany((type) => Slave, (slave) => slave.master, {
    cascade: ['insert', 'update'],
  })
  slaves: Slave[];
}
