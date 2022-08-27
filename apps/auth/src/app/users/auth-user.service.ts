import {
  CACHE_MANAGER,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';
import { ISecretService } from '@iot-framework/core';
import { RefreshTokenKey } from '@iot-framework/utils';
import {
  CreateUserDto,
  User,
  UserQueryRepository,
  UserRepository,
} from '@iot-framework/entities';
import { JwtService } from '@nestjs/jwt';
import {
  AuthUserDto,
  RefreshTokenDto,
  ResponseEntity,
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

  async signUp(
    createUserDto: CreateUserDto
  ): Promise<ResponseEntity<User | null>> {
    const { email } = createUserDto;

    const exist = await this.userQueryRepository.findOneByEmail(email);
    if (exist) {
      return ResponseEntity.ERROR_WITH('Exist User!', HttpStatus.CONFLICT);
    }

    /** Todo: Validate phone number service */
    // const existPhoneNumber = await this.userRepository.findOneBy({
    //   phoneNumber,
    // });
    //
    // if (exist || existPhoneNumber) {
    //   return ResponseEntity.ERROR_WITH('Exist User!', HttpStatus.CONFLICT);
    // }

    const user = await this.userRepository.createUser(createUserDto);
    if (!user) {
      return ResponseEntity.ERROR_WITH(
        'user not created. maybe duplicated FK',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log(`Created: `, user);
    return ResponseEntity.OK();
    // return ResponseEntity.OK_WITH(user);
  }

  async validateUser(
    email: string,
    rawPassword: string
  ): Promise<ResponseEntity<AuthUserDto | null>> {
    try {
      const user = await this.userQueryRepository.findOneByEmail(email);
      console.log('auth : ', user);

      if (!user) {
        return ResponseEntity.ERROR_WITH(
          'User Does Not Exist!',
          HttpStatus.UNAUTHORIZED
        );
      }
      console.log(`Found User: `, user);

      /** Compare fail */
      if (!(await compare(rawPassword, user.password))) {
        return ResponseEntity.ERROR_WITH(
          `Password Invalid` /** Todo: Remove after prod */,
          HttpStatus.UNAUTHORIZED
        );
      }

      const { password, createdAt, ...userWithoutPassword } = user;
      return ResponseEntity.OK_WITH<AuthUserDto>(userWithoutPassword);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async compareRefreshToken(userId: number, refreshToken: string) {
    const key = RefreshTokenKey(userId); // 🤔 Need Refactor!!
    const cachedRefreshToken = await this.cacheManager.get<string>(key);

    return refreshToken === cachedRefreshToken;
  }

  async regenerateAccessToken(userId: number, refreshToken: string) {
    if (await this.compareRefreshToken(userId, refreshToken)) {
      /** Todo: refactor token user without password */
      const { password, createdAt, ...userWithoutPassword } =
        await this.userQueryRepository.findOneUserById(userId);

      const accessToken = this.signAccessToken(userWithoutPassword);

      return ResponseEntity.OK_WITH({ userId, accessToken });
    }

    /** ?? */
    const key = RefreshTokenKey(userId);
    await this.cacheManager.del(key);
  }

  async signRefreshToken(userId: number): Promise<string> {
    try {
      const token = this.jwtService.sign(
        {},
        {
          secret: this.secretService.JWT_REFRESH_SECRET,
          expiresIn: this.secretService.JWT_REFRESH_EXPIRES_IN,
        }
      );

      const key = RefreshTokenKey(userId);
      await this.cacheManager.set<string>(key, token, { ttl: 1209600 }); // 🤔 2주
      Logger.debug(await this.cacheManager.get<string>(key));

      return token;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  signAccessToken(authUserDto: AuthUserDto) {
    return this.jwtService.sign(authUserDto);
  }

  async signIn(authUserDto: AuthUserDto): Promise<TokensDto> {
    const accessToken = this.signAccessToken(authUserDto);
    const refreshToken = await this.signRefreshToken(authUserDto.id);

    return {
      user: authUserDto,
      accessToken,
      refreshToken,
    };
  }

  async signOut(userId: number) {
    const key = RefreshTokenKey(userId);
    return this.cacheManager.del(key);
  }
}
