import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
// import { SignInDto } from './dto/sign-in.dto';
import { SignInDto } from '@iot-framework/modules';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TokensDto } from './dto/tokens.dto';
import { SWAGGER_TAG } from '../../../utils/swagger/enum';
import { ApiAuthService } from './api-auth.service';
import { JwtAuthGuard, LocalAuthGuard, ResponseEntity } from '@iot-framework/modules';
import { Tokens } from './decoratos/tokens.decorator';
import { CreateUserDto, User } from '@iot-framework/entities';
import { RefreshTokenDto } from '@iot-framework/modules';
import { AuthUser } from './decoratos/auth-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { ISecretService } from '@iot-framework/core';

@ApiTags(SWAGGER_TAG.AUTH)
@ApiBearerAuth()
@Controller('auth-service')
export class ApiAuthController {
  constructor(private readonly userService: ApiAuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@AuthUser() authUser: AuthUserDto): Promise<ResponseEntity<Partial<User>>> {
    return this.userService.getUser(authUser.id);
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Sign up result example' })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<ResponseEntity<unknown>> {
    return this.userService.signUp(createUserDto);
  }

  /** Todo: extract to auth MS */
  @Get('jwt')
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  jwt() {
    return true;
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    console.log(`refresh token: `, req.cookies['refresh']);
    const refreshTokenDto: RefreshTokenDto = req.cookies['refresh'];
    if (!refreshTokenDto) {
      return res.send(ResponseEntity.ERROR_WITH('Auth Cookie Not Found', HttpStatus.UNAUTHORIZED));
    }

    const response = await this.userService.refresh(refreshTokenDto);
    return res.send(response);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ description: 'Login API', type: ResponseEntity })
  async signIn(@Body() signInDto: SignInDto, @Tokens() tokens: TokensDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = tokens;

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.send(ResponseEntity.OK_WITH(accessToken));
  }

  @Post('signout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req: Request, @Res() res: Response, @AuthUser() authUser: AuthUserDto) {
    console.log(`Cookies: `, { ...req?.cookies });
    const refreshToken = req.cookies['refresh'];
    console.log(`Signout User: `, authUser);

    if (!refreshToken) {
      return res.send(ResponseEntity.ERROR_WITH('Cookie Not Exist', HttpStatus.BAD_REQUEST));
    }

    await this.userService.signOut(authUser.id);

    res.clearCookie('refresh', {
      maxAge: 0,
    });

    return res.send(ResponseEntity.OK());
  }
}
