import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export abstract class BaseTimeEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  @IsDate()
  updatedAt: Date;
}
