import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave';
import { User } from '../../user';

@Entity('masters')
export class Master extends BaseTimeEntity {
  @ApiProperty({ example: 1234, description: 'Master id' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty({ example: 1234, description: 'Master id' })
  @IsNumber()
  @Column({ unique: true, name: 'master_id' })
  masterId: number;

  @ApiProperty({ example: 'example', description: 'Example address' })
  @Column({ name: 'address' })
  @IsString()
  address: string;

  @ApiProperty()
  @Column({ name: 'user_fk' })
  userFK: number;

  @JoinColumn({ name: 'user_fk', referencedColumnName: 'id' })
  @ManyToOne((type) => User, (user) => user.masters)
  user: User;

  @OneToMany((type) => Slave, (slave) => slave.master, {
    cascade: ['insert', 'update'],
  })
  slaves: Slave[];
}
