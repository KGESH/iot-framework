import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave/slave.entity';

@Entity('temperatures')
export class Temperature extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ name: 'slave_fk' })
  slave_fk: number;

  @JoinColumn({ name: 'slave_fk' })
  @ManyToOne((type) => Slave, (slave) => slave.temperatures)
  slave: Slave;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;
}
