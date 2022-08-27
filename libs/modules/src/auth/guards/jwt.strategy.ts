import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ISecretService } from '@iot-framework/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly secretService: ISecretService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretService.JWT_ACCESS_SECRET,
    });
  }

  /** After return,
   * passport insert your return value
   * in request.user
   * */
  async validate(payload) {
    return payload;
  }
}
