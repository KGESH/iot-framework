import { Test } from '@nestjs/testing';
import { ApiTemperatureService } from '../api-temperature.service';
import { TemperatureService } from '../temperature.service';
import { DeviceThermometerService } from '../thermometer/device-thermometer.service';
import {
  Slave,
  SlaveModule,
  SlaveQueryRepository,
  Temperature,
  TemperatureModule,
  TemperatureQueryRepository,
  Thermometer,
  ThermometerQueryRepository,
} from '@iot-framework/entities';
import { addDays } from 'date-fns';
import { CacheModule } from '@nestjs/common';
import { DeviceFanService } from '../fan/device-fan.service';
import { TemperatureRepository } from '../temperature.repository';
import { TestDatabaseModule } from '@iot-framework/modules';
import { MqttService } from '../../../../mqtt/mqtt.service';
import { MQTT_TOKEN } from '../../../../mqtt/enum';
import { MockMqttBroker } from '@iot-framework/utils';
import { ThermometerRepository } from '../thermometer/thermometer.repository';
import { ResponseEntity } from '@iot-framework/modules';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Device MS / API Temperature Service', () => {
  let service: ApiTemperatureService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        CacheModule.register(),
        // SlaveModule,
        // TemperatureModule,
        // TypeOrmModule.forRoot(TestDatabaseConfigs),
        TestDatabaseModule,
        // TypeOrmModule.forFeature([Slave, Thermometer, Temperature]),
      ],

      providers: [
        MqttService,
        { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker },
        ApiTemperatureService,
        TemperatureService,
        DeviceFanService,
        DeviceThermometerService,
        TemperatureRepository,
        ThermometerRepository,
        ThermometerQueryRepository,
        SlaveQueryRepository,
        TemperatureQueryRepository,
      ],
    }).compile();

    service = app.get<ApiTemperatureService>(ApiTemperatureService);
  });

  it('should be define', () => {
    expect(service).toBeDefined();
  });

  it('throw cached temperature not found', async () => {
    const notFoundResult = service.getCurrentTemperature(1, 11);
    await expect(notFoundResult).rejects.toEqual(
      ResponseEntity.ERROR_WITH('Cached temperature not found!', 400)
    );
  });

  it('throw slave not found', async () => {
    const mockBeginDate = new Date('2022-01-01');
    const mockEndDate = addDays(mockBeginDate, 7);
    const notFoundResult = await service.getTemperatures({
      masterId: 1,
      slaveId: 11,
      begin: mockBeginDate,
      end: mockEndDate,
    });

    await expect(notFoundResult).toEqual(
      ResponseEntity.ERROR_WITH('Cached temperature not found!', 400)
    );
  });
});
