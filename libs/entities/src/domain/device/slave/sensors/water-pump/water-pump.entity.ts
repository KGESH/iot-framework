import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Slave } from '../../index';
import { BaseTimeEntity } from '../../../../base-time.entity';
import { EPowerState } from '@iot-framework/utils';

@Entity('water_pumps')
export class WaterPump extends BaseTimeEntity {
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
  @OneToOne((type) => Slave, (slave) => slave.waterConfig, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  slave: Slave;
}
