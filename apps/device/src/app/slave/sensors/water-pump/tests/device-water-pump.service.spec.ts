import { Test, TestingModule } from '@nestjs/testing';
import { MqttService } from '../../../../mqtt/mqtt.service';
import { MQTT_TOKEN } from '../../../../mqtt/enum';
import { DeviceWaterPumpService } from '../device-water-pump.service';
import { MockMqttBroker } from '@iot-framework/utils';

describe('DeviceWaterPumpService', () => {
  let service: DeviceWaterPumpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MqttService,
        { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker },
        DeviceWaterPumpService,
      ],
    }).compile();

    service = module.get<DeviceWaterPumpService>(DeviceWaterPumpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be make packet', async () => {
    const packet = await service.sendConfigPacket({
      masterId: 11,
      slaveId: 22,
      waterPumpRuntime: 33,
      waterPumpCycle: 44,
    });

    console.log(`Recv: `, packet);
    expect(packet).toEqual({
      pattern: 'master/1111/water',
      data: {
        start: 35,
        index: 35,
        target_id: 22,
        command: 209,
        data_length: 5,
        address_high: 15,
        address_low: 161,
        data_list: [170, 0, 44, 0, 33],
      },
    });
  });
});
