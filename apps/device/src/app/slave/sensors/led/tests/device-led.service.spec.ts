import { Test, TestingModule } from '@nestjs/testing';
import { DeviceLedService } from '../device-led.service';
import { MqttService } from '../../../../mqtt/mqtt.service';
import { MQTT_TOKEN } from '../../../../mqtt/enum';
import { MockMqttBroker } from '@iot-framework/utils';

describe('DeviceLedService', () => {
  let service: DeviceLedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MqttService,
        { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker },
        DeviceLedService,
      ],
    }).compile();

    service = module.get<DeviceLedService>(DeviceLedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be make packet', async () => {
    const packet = await service.sendConfigPacket({
      masterId: 1111,
      slaveId: 2222,
      ledCycle: 44,
      ledRuntime: 33,
    });

    expect(packet).toEqual({
      pattern: 'master/1111/led',
      data: {
        start: 35,
        index: 35,
        target_id: 2222,
        command: 209,
        data_length: 5,
        address_high: 15,
        address_low: 221,
        data_list: [170, 0, 44, 0, 33],
      },
    });
  });
});
