import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave/slave.entity';

@Entity('thermometers')
export class Thermometer extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  rangeBegin: number;

  @Column({ type: 'integer' })
  rangeEnd: number;

  @Column({ type: 'integer' })
  updateCycle: number;

  @OneToOne((type) => Slave, (slave) => slave.thermometerConfig, {
    cascade: true,
  })
  slave: Slave;
}
