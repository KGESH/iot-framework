import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../base-time.entity';
import { Slave } from '../slave';
import { EPowerState } from '@iot-framework/utils';

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

  @Column({
    type: 'enum',
    enum: EPowerState,
    name: 'power_state',
    default: EPowerState.OFF,
  })
  powerState: EPowerState;

  @OneToOne((type) => Slave, (slave) => slave.thermometerConfig, {
    cascade: true,
  })
  slave: Slave;
}
