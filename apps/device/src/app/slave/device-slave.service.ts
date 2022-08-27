import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Led,
  Master,
  Slave,
  Thermometer,
  WaterPump,
} from '@iot-framework/entities';
import { Repository } from 'typeorm';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { defaultSlaveConfig, ISlaveConfigs } from './types/slave-config';
import { SlaveQueryRepository } from './device-slave.repository';

@Injectable()
export class DeviceSlaveService {
  constructor(
    @InjectRepository(Master)
    private readonly masterRepository: Repository<Master>,
    @InjectRepository(Slave)
    private slaveRepository: Repository<Slave>,
    private slaveQueryRepository: SlaveQueryRepository,
    @InjectRepository(Thermometer)
    private thermometerRepository: Repository<Thermometer>,
    @InjectRepository(WaterPump)
    private waterPumpRepository: Repository<WaterPump>,
    @InjectRepository(Led) private ledRepository: Repository<Led>
  ) {}

  async createSlave(createSlaveDto: CreateSlaveDto) {
    const { masterId, slaveId } = createSlaveDto;

    const master = await this.masterRepository.findOne({
      where: { masterId },
    });

    if (!master) {
      /** Todo: Throw Error */
      console.log(`Master Not Found!`);
      return;
    }

    const ledConfig = this.ledRepository.create({ ...defaultSlaveConfig });
    const waterConfig = this.waterPumpRepository.create({
      ...defaultSlaveConfig,
    });
    const thermometerConfig = this.thermometerRepository.create({
      ...defaultSlaveConfig,
    });

    const exist = await this.slaveRepository.findOneBy({
      master: { masterId },
      slaveId,
    });

    if (exist) {
      /** Todo: handle exception */
      console.log(`Slave Exist!`);
      throw new ConflictException('Slave already exist!');
    }

    const slave = this.slaveRepository.create({
      master,
      masterId: master.masterId,
      slaveId,
      ledConfig,
      waterConfig,
      thermometerConfig,
    });

    const saveResult = await this.slaveRepository.save(slave);

    if (!saveResult) {
      /** Todo: Throw Error */
      console.log(`Slave Create Error!`);
      throw new InternalServerErrorException('Slave created exception!');
    }

    return slave;
  }

  findSlave(masterId: number, slaveId: number) {
    return this.slaveRepository.findOne({ where: { masterId, slaveId } });
  }

  deleteSlave(masterId: number, slaveId: number) {
    return this.slaveQueryRepository.deleteSlave(masterId, slaveId);
  }

  async getConfigs(masterId: number, slaveId: number) {
    try {
      const fetched = await this.slaveQueryRepository.getConfigs(
        masterId,
        slaveId
      );
      if (!fetched) {
        return;
      }

      const configs: ISlaveConfigs = {
        rangeBegin: fetched.rangebegin,
        rangeEnd: fetched.rangeend,
        updateCycle: fetched.updatecycle,
        waterPumpCycle: fetched.waterpumpcycle,
        waterPumpRuntime: fetched.waterpumpruntime,
        ledCycle: fetched.ledcycle,
        ledRuntime: fetched.ledruntime,
      };

      return configs;
    } catch (e) {
      throw new Error(e);
    }
  }
}
