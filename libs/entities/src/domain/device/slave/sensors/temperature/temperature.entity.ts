import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../../base-time.entity';
import { Slave } from '../../index';

@Entity('temperatures')
export class Temperature extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ name: 'slave_fk' })
  slaveFK: number;

  @JoinColumn({ name: 'slave_fk' })
  @ManyToOne((type) => Slave, (slave) => slave.temperatures)
  slave: Slave;
}
