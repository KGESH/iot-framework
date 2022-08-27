import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '@iot-framework/entities';

export const RolesGuard = (roles: UserRoles[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
      context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
      console.log(`Call Roles Guard`);
      const request = context.switchToHttp().getRequest();

      /** Todo: Fix eslint */
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { role } = request.body?.user;
      console.log(`Role: `, role);

      return roles.includes(role);
    }
  }

  /** Todo: Handle Unauthorized Role */

  return mixin(RoleGuardMixin);
};
