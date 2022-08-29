import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Slave } from '../slave';
import { BaseTimeEntity } from '../../base-time.entity';

@Entity('water_pumps')
export class WaterPump extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cycle: number;

  @Column({ type: 'integer' })
  runtime: number;

  @OneToOne((type) => Slave, (slave) => slave.waterConfig, {
    cascade: true,
  })
  slave: Slave;
}
