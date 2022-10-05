import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { TokensDto } from '@iot-framework/modules';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: `email`, passwordField: `password` });
  }

  async validate(email: string, password: string): Promise<TokensDto> {
    const signInResult = await this.authService.signIn(email, password);
    // console.log(signInResult.data);

    if (signInResult.statusCode !== HttpStatus.OK) {
      throw signInResult;
    }

    return signInResult.data;
  }
}
