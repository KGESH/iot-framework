import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tokens = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(`Deco: `, request.user);

  return request.user;
});
