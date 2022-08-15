import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave/slave.entity';

@Entity('leds')
export class Led extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  ledCycle: number;

  @Column({ type: 'integer' })
  ledRuntime: number;

  @OneToOne((type) => Slave, (slave) => slave.ledConfig, {
    cascade: true,
  })
  slave: Slave;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;
}
