import { Injectable } from '@nestjs/common';
import { ISecretService } from '@iot-framework/core';
import { CreateUserDto, User } from '@iot-framework/entities';
import { AuthService, RefreshTokenDto, ResponseEntity } from '@iot-framework/modules';

@Injectable()
export class ApiAuthService {
  constructor(
    private readonly secretService: ISecretService,
    private readonly authService: AuthService
  ) {}

  getUser(userId: number): Promise<ResponseEntity<Omit<User, 'password'>>> {
    return this.authService.getUser(userId);
  }

  signUp(createUserDto: CreateUserDto): Promise<ResponseEntity<User>> {
    return this.authService.signUp(createUserDto);
  }

  refresh(dto: RefreshTokenDto): Promise<ResponseEntity<unknown>> {
    return this.authService.refresh(dto);
  }

  signOut(userId: number) {
    return this.authService.signOut(userId);
  }
}
