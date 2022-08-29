import { Test } from '@nestjs/testing';
import { MqttService } from './mqtt.service';
import { MQTT_TOKEN } from './enum';
import { MockMqttBroker } from '@iot-framework/utils';

describe('MQTT Service', () => {
  let mqttService: MqttService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        MqttService,
        { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker },
      ],
    }).compile();

    mqttService = app.get<MqttService>(MqttService);
  });

  describe('MqttService', () => {
    it('should be define', () => {
      expect(mqttService).toBeDefined();
    });

    it('should be publish message', async () => {
      const publishResult = await mqttService.publish('topic', 'payload');
      expect(publishResult).toEqual({
        pattern: 'topic',
        data: 'payload',
      });
    });
  });
});
