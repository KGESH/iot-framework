import { Test } from '@nestjs/testing';
import { MqttService } from './mqtt.service';
import { MQTT_TOKEN } from './enum';
import { MockMqttBroker } from '@iot-framework/utils';
import {
  RawPacket,
  Command,
  IndexPriority,
  IoTProtocol,
  MemoryAddressHigh,
  MemoryAddressLow,
  TargetMemoryAddress,
} from '@iot-framework/entities';

describe('MQTT Service', () => {
  let mqttService: MqttService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [MqttService, { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker }],
    }).compile();

    mqttService = app.get<MqttService>(MqttService);
  });

  describe('MqttService', () => {
    it('should be define', () => {
      expect(mqttService).toBeDefined();
    });

    it('should be publish packet', async () => {
      const mockPacket: RawPacket = {
        start: IoTProtocol.START,
        index: IndexPriority.EMERGENCY,
        target_id: TargetMemoryAddress.MASTER,
        command: Command.WRITE,
        data_length: 1,
        address_high: MemoryAddressHigh.LED,
        address_low: MemoryAddressLow.LED,
        data_list: [100],
      };

      const publishResult = await mqttService.publish('MockTopic', JSON.stringify(mockPacket));
      expect(publishResult).toEqual({
        pattern: 'MockTopic',
        data: {
          start: 0x23,
          index: 0x21,
          target_id: 0x00,
          command: 0xd1,
          data_length: 1,
          address_high: 0x0f,
          address_low: 0xdd,
          data_list: [100],
        },
      });
    });
  });
});
