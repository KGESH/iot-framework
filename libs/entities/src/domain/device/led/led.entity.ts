import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave';

@Entity('leds')
export class Led extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cycle: number;

  @Column({ type: 'integer' })
  runtime: number;

  @OneToOne((type) => Slave, (slave) => slave.ledConfig, {
    cascade: true,
  })
  slave: Slave;
}
