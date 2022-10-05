import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '@iot-framework/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserLibrary', () => {
  // let service: ApiAuthService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [],
    }).compile();

    // service = module.get<ApiAuthService>(ApiAuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('[Expect] get user info', () => {
    const user = repository.findBy({ id: 1111 });
    const expected: Partial<User> = {
      id: 0,
      username: '',
    };

    expect(user).resolves.toBeDefined();
  });
});
