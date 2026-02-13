import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtTokenService } from "./jwt-token.service";

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as {
      headers?: Record<string, string | undefined>;
      user?: { id: string; role?: string } | null;
    };
    const authHeader = request.headers?.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    request.user = this.jwtTokenService.tryVerifyToken(token);
    return true;
  }
}
