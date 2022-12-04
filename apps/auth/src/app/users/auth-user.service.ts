import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';
import { ISecretService } from '@iot-framework/core';
import { GenerateRefreshTokenKey } from '@iot-framework/utils';
import { CreateUserDto, User, UserQueryRepository, UserRepository } from '@iot-framework/entities';
import { JwtService } from '@nestjs/jwt';
import {
  AuthUserDto,
  RedisTTL,
  ResponseEntity,
  SignInDto,
  TokensDto,
} from '@iot-framework/modules';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly secretService: ISecretService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository
  ) {}

  async getUserWithoutPassword(userId: number): Promise<ResponseEntity<Partial<User>>> {
    const { password, createdAt, deletedAt, updatedAt, ...userWithoutPassword } =
      await this.userQueryRepository.findOneUserById(userId);

    return ResponseEntity.OK_WITH({ ...userWithoutPassword });
  }

  async signUp(createUserDto: CreateUserDto): Promise<ResponseEntity<null>> {
    const { email } = createUserDto;

    const existUser = await this.userQueryRepository.findOneByEmail(email);
    if (existUser) {
      return ResponseEntity.ERROR_WITH('User already exist!', HttpStatus.BAD_REQUEST);
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

  async signIn(signInDto: SignInDto): Promise<ResponseEntity<AuthUserDto | TokensDto>> {
    const { email, password } = signInDto;

    const validatedResult = await this.validateUser(email, password);
    const validateFail = validatedResult.statusCode !== HttpStatus.OK;
    if (validateFail) {
      return validatedResult;
    }

    const authUser = validatedResult.data;
    const tokens = await this.generateTokens(authUser);

    return ResponseEntity.OK_WITH(tokens);
  }

  private async validateUser(
    email: string,
    rawPassword: string
  ): Promise<ResponseEntity<AuthUserDto>> {
    const foundUser = await this.userQueryRepository.findOneByEmail(email);
    if (!foundUser) {
      return ResponseEntity.ERROR_WITH(`Invalid user!`, HttpStatus.UNAUTHORIZED);
    }

    const isCorrectPassword = await compare(rawPassword, foundUser.password);
    if (isCorrectPassword) {
      const { password, createdAt, updatedAt, deletedAt, ...userWithoutPassword } = foundUser;
      return ResponseEntity.OK_WITH<AuthUserDto>(userWithoutPassword);
    }

    return ResponseEntity.ERROR_WITH(`Invalid user!`, HttpStatus.UNAUTHORIZED);
  }

  private async generateTokens(authUserDto: AuthUserDto): Promise<TokensDto> {
    const userId = authUserDto.id;
    const accessToken = this.generateAccessToken(authUserDto);
    const refreshToken = this.generateRefreshToken(userId);

    /** Todo: save token to database */
    await this.cacheRefreshToken(userId, refreshToken);

    return {
      user: authUserDto,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(authUserDto: AuthUserDto) {
    return this.jwtService.sign(authUserDto);
  }

  private generateRefreshToken(userId: number) {
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
    await this.cacheManager.set<string>(key, refreshToken, { ttl: RedisTTL.WEEK * 2 });
  }

  async regenerateAccessToken(userId: number, refreshToken: string) {
    const cachedRefreshToken = await this.getCachedRefreshToken(userId);

    if (refreshToken === cachedRefreshToken) {
      const { password, createdAt, ...userWithoutPassword } =
        await this.userQueryRepository.findOneUserById(userId);

      const accessToken = this.generateAccessToken(userWithoutPassword);
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
}
