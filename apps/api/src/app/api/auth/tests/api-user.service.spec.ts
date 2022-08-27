import { Test, TestingModule } from '@nestjs/testing';
import { SecretModule } from '@iot-framework/core';
import { HttpModule } from '@nestjs/axios';
import { ApiAuthService } from '../api-auth.service';

describe('ApiUserService', () => {
  let service: ApiAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SecretModule, HttpModule],
      providers: [ApiAuthService],
    }).compile();

    service = module.get<ApiAuthService>(ApiAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
