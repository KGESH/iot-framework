import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../../base-time.entity';
import { Slave } from '../../index';
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
    default: EPowerState.OFF,
  })
  powerState: EPowerState;

  @Column({ name: 'slave_fk', type: 'integer' })
  slaveFK: number;

  @JoinColumn({ name: 'slave_fk', referencedColumnName: 'id' })
  @OneToOne((type) => Slave, (slave) => slave.ledConfig, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  slave: Slave;
}
