import { Test } from '@nestjs/testing';
import { EPowerState, MockMqttBroker } from '@iot-framework/utils';
import { DeviceFanService } from '../device-fan.service';
import { MqttService } from '../../../../../mqtt/mqtt.service';
import { Slave } from '@iot-framework/entities';
import { MQTT_TOKEN } from '../../../../../mqtt/enum';

describe('Device MS / Device Fan Service', () => {
  let service: DeviceFanService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        MqttService,
        { provide: MQTT_TOKEN.DEVICE_BROKER, useClass: MockMqttBroker },
        DeviceFanService,
      ],
    }).compile();

    service = app.get<DeviceFanService>(DeviceFanService);
  });

  describe('Device Fan Service', () => {
    it('should be define', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Colling', () => {
    it('should be send cooling mqtt packet', () => {
      const mockSlave: Slave = new Slave();
      mockSlave.masterId = 11;
      mockSlave.slaveId = 22;

      const collingMqttPacket = service.cooling(mockSlave, EPowerState.ON);
      const expectPacket = {
        data: {
          start: 35,
          index: 34,
          target_id: 22,
          command: 209,
          data_length: 1,
          address_high: 16,
          address_low: 25,
          data_list: [251],
        },
        pattern: 'master/11/fan',
      };

      expect(collingMqttPacket).toEqual(expectPacket);
    });
  });
});
