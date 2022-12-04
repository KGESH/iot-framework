import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ISecretService } from '@iot-framework/core';
import { User, UserQueryRepository, CreateUserDto } from '../../../entities/src/domain/user';
import { ResponseEntity } from '../response/response.entity';
import { TokensDto } from './dto/tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthClientService } from '../microservice-client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly secretService: ISecretService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly authClientService: AuthClientService
  ) {}

  async getUser(userId: number): Promise<ResponseEntity<Omit<User, 'password'>>> {
    return this.authClientService.get<ResponseEntity<Omit<User, 'password'>>>(`me/${userId}`);
  }

  async signUp(createUserDto: CreateUserDto): Promise<ResponseEntity<User>> {
    return this.authClientService.post<ResponseEntity<User>>('signup', createUserDto);
  }

  async signIn(email: string, rawPassword: string): Promise<ResponseEntity<TokensDto | null>> {
    return this.authClientService.post<ResponseEntity<TokensDto | null>>('signin', {
      email,
      password: rawPassword,
    });
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<ResponseEntity<unknown>> {
    return this.authClientService.post('refresh', { ...refreshTokenDto });
  }

  signOut(userId: number) {
    return this.authClientService.get('signout', { params: { userId } });
  }
}
