import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtTokenService } from "./jwt-token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as {
      headers?: Record<string, string | undefined>;
      user?: { id: string; role?: string };
    };

    const authorization = request.headers?.authorization;
    request.user = this.jwtTokenService.verifyAuthorizationHeader(authorization);
    return true;
  }
}
