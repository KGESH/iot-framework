import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokensDto } from './dto/tokens.dto';
import { SWAGGER_TAG } from '../../../utils/swagger/enum';
import { ApiAuthService } from './api-auth.service';
import {
  JwtAuthGuard,
  LocalAuthGuard,
  ResponseEntity,
} from '@iot-framework/modules';
import { Tokens } from './decoratos/tokens.decorator';
import { CreateUserDto } from '@iot-framework/entities';
import { RefreshTokenDto } from '@iot-framework/modules';

@ApiTags(SWAGGER_TAG.AUTH)
@Controller('auth-service')
export class ApiAuthController {
  constructor(private userService: ApiAuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'Sign up result example' })
  async signUp(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseEntity<unknown>> {
    return this.userService.signUp(createUserDto);
  }

  /** Todo: extract to auth MS */
  @Get('jwt')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  jwt() {
    return true;
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshTokenDto: RefreshTokenDto = req.cookies['auth-cookie'];
    if (!refreshTokenDto) {
      return res.send(
        ResponseEntity.ERROR_WITH('Auth Cookie Not Found', HttpStatus.NOT_FOUND)
      );
    }

    const response = await this.userService.refresh(refreshTokenDto);
    return res.send(response);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ description: 'Login API', type: TokensDto })
  async signIn(
    @Body() signInDto: SignInDto,
    @Tokens() tokens: TokensDto,
    @Res() res: Response
  ) {
    const { accessToken, refreshToken, user } = tokens;

    const refreshTokenDto: RefreshTokenDto = { userId: user.id, refreshToken };

    res.cookie('auth-cookie', refreshTokenDto, {
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
    });

    return res.send(ResponseEntity.OK_WITH(accessToken));
  }

  @Get('signout')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const tokens = req.cookies['auth-cookie'];

    if (!tokens) {
      return res.send(
        ResponseEntity.ERROR_WITH('Cookie Not Exist', HttpStatus.NOT_FOUND)
      );
    }

    await this.userService.signOut(tokens.userId);

    res.clearCookie('auth-cookie', {
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
    });

    return res.send(ResponseEntity.OK());
  }
}
