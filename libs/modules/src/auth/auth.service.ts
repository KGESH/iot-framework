import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ISecretService } from '@iot-framework/core';
import { ValidateJwtDto } from './dto/validate-jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserQueryRepository } from '@iot-framework/entities';
import { ResponseEntity } from '../response/response.entity';
import { TokensDto } from './dto/tokens.dto';
import { CreateUserDto } from '@iot-framework/entities';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthClientService } from '../microservice-client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly secretService: ISecretService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly jwtService: JwtService,
    private readonly authClientService: AuthClientService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ResponseEntity<User>> {
    return this.authClientService.post<ResponseEntity<User>>(
      'signup',
      createUserDto
    );
  }

  async signIn(
    email: string,
    rawPassword: string
  ): Promise<ResponseEntity<TokensDto>> {
    return this.authClientService.post('signin', {
      email,
      password: rawPassword,
    });
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto
  ): Promise<ResponseEntity<unknown>> {
    return this.authClientService.post('refresh', refreshTokenDto);
  }

  signOut(userId: number) {
    return this.authClientService.get('signout', { params: { userId } });
  }

  /** Todo: extract */
  validateToken(token: string): ValidateJwtDto {
    return this.jwtService.verify(token);
  }
}