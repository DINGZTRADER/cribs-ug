import { Module } from "@nestjs/common";
import { JwtTokenService } from "../../common/auth/jwt-token.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService, JwtTokenService],
  controllers: [AuthController]
})
export class AuthModule {}
