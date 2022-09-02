import { Injectable } from '@nestjs/common';
import { DeviceClientService, ResponseEntity } from '@iot-framework/modules';
import { TemperatureBetweenDto } from '@iot-framework/entities';

@Injectable()
export class ApiTemperatureService {
  constructor(private readonly deviceClientService: DeviceClientService) {}

  async getCachedTemperature(masterId: number, slaveId: number): Promise<ResponseEntity<number>> {
    return this.deviceClientService.get<Promise<ResponseEntity<number>>>('temperature/now', {
      params: { masterId, slaveId },
    });
  }

  async getAveragePoints(temperatureBetweenDto: TemperatureBetweenDto) {
    return this.deviceClientService.post('temperature/points', temperatureBetweenDto);
  }

  async getTemperatures(temperatureBetweenDto: TemperatureBetweenDto) {
    return this.deviceClientService.post<Promise<ResponseEntity<unknown>>>(
      'temperature/between',
      temperatureBetweenDto
    );
  }
}
