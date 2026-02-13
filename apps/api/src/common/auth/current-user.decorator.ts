import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestUser } from "./jwt-payload";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RequestUser | null => {
    const request = ctx.switchToHttp().getRequest() as { user?: RequestUser | null };
    return request.user ?? null;
  }
);
