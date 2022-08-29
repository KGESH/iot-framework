import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Master } from '../master';
import { WaterPump } from '../water-pump';
import { Led } from '../led';
import { Thermometer, Temperature } from '../temperature';

@Entity('slaves')
export class Slave {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'master_id' })
  masterId: number;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'slave_id' })
  slaveId: number;

  @JoinColumn({ name: 'master_fk', referencedColumnName: 'id' })
  @ManyToOne((type) => Master, (master) => master.slaves, {
    onDelete: 'CASCADE',
  })
  master: Master;

  @Column({ name: 'water_config_fk', type: 'integer', nullable: true })
  waterPumpFK: number;

  @JoinColumn({ name: 'water_config_fk' })
  @OneToOne((type) => WaterPump, (waterPump) => waterPump.slave, {
    cascade: ['insert', 'update'],
  })
  waterConfig: WaterPump;

  @Column({ name: 'led_config_fk', type: 'integer', nullable: true })
  ledFK: number;

  @JoinColumn({ name: 'led_config_fk' })
  @OneToOne((type) => Led, (led) => led.slave, {
    cascade: ['insert', 'update'],
  })
  ledConfig: Led;

  @Column({ name: 'thermometer_config_fk', type: 'integer', nullable: true })
  thermometerFK: number;

  @JoinColumn({ name: 'thermometer_config_fk' })
  @OneToOne((type) => Thermometer, (thermometer) => thermometer.slave, {
    cascade: ['insert', 'update'],
  })
  thermometerConfig: Thermometer;

  @OneToMany((type) => Temperature, (temperature) => temperature.slave)
  temperatures: Temperature[];
}
