import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave';
import { EPowerState } from '@iot-framework/utils';

@Entity('leds')
export class Led extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cycle: number;

  @Column({ type: 'integer' })
  runtime: number;

  @Column({
    type: 'enum',
    enum: EPowerState,
    name: 'power_state',
    default: EPowerState.OFF,
  })
  powerState: EPowerState;

  @OneToOne((type) => Slave, (slave) => slave.ledConfig, {
    cascade: true,
  })
  slave: Slave;
}
