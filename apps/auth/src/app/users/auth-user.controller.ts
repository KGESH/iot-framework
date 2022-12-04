import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('me/:id')
  async getUser(@Param('id') userId: string): Promise<ResponseEntity<Partial<User>>> {
    return await this.authService.getUserWithoutPassword(parseInt(userId));
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<ResponseEntity<null>> {
    return await this.authService.signUp(createUserDto);
  }

  @Get('signout')
  async signOut(@Query('userId') userId: number) {
    return this.authService.signOut(userId);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<ResponseEntity<AuthUserDto | TokensDto>> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<ResponseEntity<unknown>> {
    console.log(`AUTH SERVER: `, refreshTokenDto);
    const { user, refreshToken } = refreshTokenDto;

    return this.authService.regenerateAccessToken(user.id, refreshToken);
  }
}
