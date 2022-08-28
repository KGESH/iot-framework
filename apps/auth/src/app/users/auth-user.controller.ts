import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import {
  AuthUserDto,
  RefreshTokenDto,
  ResponseEntity,
  SignInDto,
  TokensDto,
} from '@iot-framework/modules';
import { CreateUserDto, User } from '@iot-framework/entities';

@Controller()
export class AuthUserController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseEntity<User>> {
    const result = await this.authService.signUp(createUserDto);
    console.log(`AUTH: Signup res: `, result);
    return result;
  }

  @Get('signout')
  async signOut(@Query('userId') userId: number) {
    return this.authService.signOut(userId);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto
  ): Promise<ResponseEntity<AuthUserDto | TokensDto>> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<ResponseEntity<unknown>> {
    const { userId, refreshToken } = refreshTokenDto;

    return this.authService.regenerateAccessToken(userId, refreshToken);
  }
}
