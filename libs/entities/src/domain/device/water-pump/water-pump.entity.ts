import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Slave } from '../slave/slave.entity';

@Entity('water_pumps')
export class WaterPump {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  waterPumpCycle: number;

  @Column({ type: 'integer' })
  waterPumpRuntime: number;

  @OneToOne((type) => Slave, (slave) => slave.waterConfig, {
    cascade: true,
  })
  slave: Slave;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;
}
