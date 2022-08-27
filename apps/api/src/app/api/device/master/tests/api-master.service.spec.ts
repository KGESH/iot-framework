import { Test, TestingModule } from '@nestjs/testing';
import { SecretModule } from '@iot-framework/core';
import { HttpModule } from '@nestjs/axios';
import { ApiMasterService } from '../api-master.service';

describe('ApiMasterService', () => {
  let service: ApiMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SecretModule, HttpModule],
      providers: [ApiMasterService],
    }).compile();

    service = module.get<ApiMasterService>(ApiMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
