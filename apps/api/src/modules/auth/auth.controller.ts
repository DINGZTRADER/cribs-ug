import { Body, Controller, Post } from "@nestjs/common";
import { validateOrThrow } from "../../common/validation/validate-or-throw";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schemas";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: unknown) {
    const parsed = validateOrThrow(registerSchema, body, "Invalid register payload.");
    return this.authService.register({
      ...parsed,
      role: parsed.role ?? "tenant"
    });
  }

  @Post("login")
  login(@Body() body: unknown) {
    const parsed = validateOrThrow(loginSchema, body, "Invalid login payload.");
    return this.authService.login(parsed);
  }
}
