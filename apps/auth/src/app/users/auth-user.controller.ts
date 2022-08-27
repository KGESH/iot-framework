import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import {
  RefreshTokenDto,
  ResponseEntity,
  SignInDto,
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
  async signIn(@Body() signInDto: SignInDto): Promise<ResponseEntity<unknown>> {
    const { email, password } = signInDto;

    const validateResult = await this.authService.validateUser(email, password);
    const user = validateResult?.data;
    console.log(`AUTH SIGNIN`, validateResult);
    /** Validate Fail */
    if (!user) {
      return validateResult;
    }

    const tokens = await this.authService.signIn(user);
    return ResponseEntity.OK_WITH(tokens);
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto
  ): Promise<ResponseEntity<unknown>> {
    const { userId, refreshToken } = dto;

    console.log(`DTO: `, dto);

    return this.authService.regenerateAccessToken(userId, refreshToken);
  }
}
