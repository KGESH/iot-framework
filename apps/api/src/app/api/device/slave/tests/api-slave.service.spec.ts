import { Test, TestingModule } from '@nestjs/testing';
import { SecretModule } from '@iot-framework/core';
import { HttpModule } from '@nestjs/axios';
import { ApiSlaveService } from '../api-slave.service';
import { ApiMasterService } from '../../master/api-master.service';

describe('ApiSlaveService', () => {
  let service: ApiSlaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SecretModule, HttpModule],
      providers: [ApiSlaveService, ApiMasterService],
    }).compile();

    service = module.get<ApiSlaveService>(ApiSlaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
