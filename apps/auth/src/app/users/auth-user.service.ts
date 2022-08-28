import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';
import { ISecretService } from '@iot-framework/core';
import { GenerateRefreshTokenKey } from '@iot-framework/utils';
import {
  CreateUserDto,
  User,
  UserQueryRepository,
  UserRepository,
} from '@iot-framework/entities';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto, ResponseEntity, TokensDto } from '@iot-framework/modules';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly secretService: ISecretService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository
  ) {}

  async signUp(
    createUserDto: CreateUserDto
  ): Promise<ResponseEntity<User | null>> {
    const { email } = createUserDto;

    const existUser = await this.userQueryRepository.findOneByEmail(email);
    if (existUser) {
      return ResponseEntity.ERROR_WITH(
        'User already exist!',
        HttpStatus.CONFLICT
      );
    }

    /** Todo: Validate phone number service */
    const isCreated = await this.userRepository.createUser(createUserDto);
    if (isCreated) {
      return ResponseEntity.OK();
    }

    return ResponseEntity.ERROR_WITH(
      'user not created. maybe duplicated FK',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async signOut(userId: number) {
    const key = GenerateRefreshTokenKey(userId);
    return this.cacheManager.del(key);
  }

  async signIn(authUserDto: AuthUserDto): Promise<TokensDto> {
    const userId = authUserDto.id;
    const accessToken = this.getAccessToken(authUserDto);
    const refreshToken = this.getRefreshToken(userId);

    await this.cacheRefreshToken(userId, refreshToken);

    return {
      user: authUserDto,
      accessToken,
      refreshToken,
    };
  }

  private getAccessToken(authUserDto: AuthUserDto) {
    return this.jwtService.sign(authUserDto);
  }

  private getRefreshToken(userId: number) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.secretService.JWT_REFRESH_SECRET,
        expiresIn: this.secretService.JWT_REFRESH_EXPIRES_IN,
      }
    );
  }

  private async cacheRefreshToken(userId: number, refreshToken: string) {
    const key = GenerateRefreshTokenKey(userId);
    await this.cacheManager.set<string>(key, refreshToken, { ttl: 1209600 }); // 🤔 2주
  }

  async validateUser(
    email: string,
    rawPassword: string
  ): Promise<ResponseEntity<AuthUserDto | null>> {
    try {
      const foundUser = await this.userQueryRepository.findOneByEmail(email);
      if (!foundUser) {
        return ResponseEntity.ERROR_WITH(
          `Invalid user!`,
          HttpStatus.UNAUTHORIZED
        );
      }

      const isCorrectPassword = await compare(rawPassword, foundUser.password);
      if (isCorrectPassword) {
        const { password, createdAt, ...userWithoutPassword } = foundUser;
        return ResponseEntity.OK_WITH<AuthUserDto>(userWithoutPassword);
      }

      return ResponseEntity.ERROR_WITH(
        `Invalid user!`,
        HttpStatus.UNAUTHORIZED
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async regenerateAccessToken(userId: number, refreshToken: string) {
    const cachedRefreshToken = await this.getCachedRefreshToken(userId);

    const isCorrect = this.compareRefreshToken(
      refreshToken,
      cachedRefreshToken
    );
    if (isCorrect) {
      const { password, createdAt, ...userWithoutPassword } =
        await this.userQueryRepository.findOneUserById(userId);

      const accessToken = this.getAccessToken(userWithoutPassword);

      return ResponseEntity.OK_WITH({ userId, accessToken });
    }

    /** ?? */
    const key = GenerateRefreshTokenKey(userId);
    await this.cacheManager.del(key);
  }

  private async getCachedRefreshToken(userId: number): Promise<string> {
    const key = GenerateRefreshTokenKey(userId);
    return await this.cacheManager.get<string>(key);
  }

  private compareRefreshToken(
    refreshToken: string,
    cachedRefreshToken: string
  ): boolean {
    return refreshToken === cachedRefreshToken;
  }
}
