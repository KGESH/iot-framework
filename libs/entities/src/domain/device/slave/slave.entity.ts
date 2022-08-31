import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Master } from '../master';
import { WaterPump } from './sensors/water-pump';
import { Led } from './sensors/led';
import { Thermometer, Temperature } from './sensors/temperature';
import { BaseTimeEntity } from '../../base-time.entity';

@Entity('slaves')
export class Slave extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty()
  @IsNumber()
  @Column()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  @Column()
  slaveId: number;

  @Column({ name: 'master_fk', type: 'integer' })
  masterFK: number;

  @JoinColumn({ name: 'master_fk', referencedColumnName: 'id' })
  @ManyToOne((type) => Master, (master) => master.slaves, {
    onDelete: 'CASCADE',
  })
  master: Master;

  @OneToOne((type) => WaterPump, (waterPump) => waterPump.slave, {
    cascade: ['insert', 'update'],
  })
  waterConfig: WaterPump;

  @OneToOne((type) => Led, (led) => led.slave, {
    cascade: ['insert', 'update'],
  })
  ledConfig: Led;

  @OneToOne((type) => Thermometer, (thermometer) => thermometer.slave, {
    cascade: ['insert', 'update'],
  })
  thermometerConfig: Thermometer;

  @OneToMany((type) => Temperature, (temperature) => temperature.slave)
  temperatures: Temperature[];
}
