import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.publicAddress) {
    throw new BadRequestException("publicAddress undefined in request");
  }

  return request.publicAddress;
});
