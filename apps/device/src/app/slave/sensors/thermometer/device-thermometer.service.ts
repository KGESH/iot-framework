import { MqttService } from '../../../mqtt/mqtt.service';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { SlaveQueryRepository } from '@iot-framework/entities';
import { RedisTTL, ResponseEntity } from '@iot-framework/modules';
import { ThermometerRepository } from './thermometer.repository';
import { ESlaveConfigTopic, SensorConfigKey } from '@iot-framework/utils';
import { Cache } from 'cache-manager';

@Injectable()
export class DeviceThermometerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mqttBroker: MqttService,
    private readonly slaveQueryRepository: SlaveQueryRepository,
    private readonly thermometerRepository: ThermometerRepository
  ) {}

  async setConfig(configDto: ThermometerConfigDto): Promise<ResponseEntity<null>> {
    const { masterId, slaveId } = configDto;

    const slave = await this.slaveQueryRepository.findOneByMasterSlaveIds(masterId, slaveId);

    if (!slave) {
      throw ResponseEntity.ERROR_WITH('Slave not found!', HttpStatus.BAD_REQUEST);
    }

    await this.thermometerRepository.updateConfig(slave, configDto);

    await this.cacheConfig(configDto);

    return ResponseEntity.OK();
  }

  private async cacheConfig(configDto: ThermometerConfigDto) {
    const { masterId, slaveId } = configDto;

    const key = SensorConfigKey({
      sensor: ESlaveConfigTopic.THERMOMETER,
      masterId,
      slaveId,
    });

    const cachedResult = await this.cacheManager.set<number[]>(
      key,
      [configDto.rangeBegin, configDto.rangeEnd],
      { ttl: RedisTTL.HOUR }
    );

    console.log(`Cached: `, cachedResult);
    if (!cachedResult) {
      /** Todo: logging cache error */
    }
  }
}
