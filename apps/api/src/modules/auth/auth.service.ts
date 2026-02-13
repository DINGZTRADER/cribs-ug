import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { prisma } from "@repo/database";
import { randomUUID } from "node:crypto";
import { JwtTokenService } from "../../common/auth/jwt-token.service";
import { hashPassword, verifyPassword } from "./password-hash";

type UserRole = "tenant" | "landlord" | "admin";

interface UserAuthRow {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email: string | null;
  password_hash: string | null;
}

const db = prisma as {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async register(input: {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    role: "tenant" | "landlord";
  }) {
    const existing = await this.findUserByPhone(input.phone);
    if (existing) {
      throw new ConflictException("Phone number is already registered.");
    }

    const userId = randomUUID();
    const passwordHash = hashPassword(input.password);

    try {
      await db.$executeRawUnsafe(
        `
        INSERT INTO users (
          id,
          role,
          full_name,
          phone,
          email,
          password_hash,
          badge_score,
          is_identity_verified,
          created_at
        )
        VALUES ($1, $2::"Role", $3, $4, $5, $6, 0, false, NOW())
        `,
        userId,
        input.role,
        input.fullName,
        input.phone,
        input.email ?? null,
        passwordHash
      );

      if (input.role === "landlord") {
        await db.$executeRawUnsafe(
          `
          INSERT INTO landlord_profiles (user_id, verified_owner)
          VALUES ($1, false)
          `,
          userId
        );
      } else {
        await db.$executeRawUnsafe(
          `
          INSERT INTO tenant_profiles (user_id, employment_status)
          VALUES ($1, NULL)
          `,
          userId
        );
      }
    } catch (error) {
      throw new BadRequestException("Failed to register account.");
    }

    const created = await this.findUserByPhone(input.phone);
    if (!created) {
      throw new BadRequestException("Failed to load created user.");
    }
    return this.issueSession(created);
  }

  async login(input: { phone: string; password: string }) {
    const user = await this.findUserByPhone(input.phone);
    if (!user?.password_hash) {
      throw new UnauthorizedException("Invalid phone or password.");
    }

    const valid = verifyPassword(input.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException("Invalid phone or password.");
    }

    return this.issueSession(user);
  }

  private async findUserByPhone(phone: string): Promise<UserAuthRow | null> {
    const rows = await db.$queryRawUnsafe<UserAuthRow[]>(
      `
      SELECT id, role, full_name, phone, email, password_hash
      FROM users
      WHERE phone = $1
      LIMIT 1
      `,
      phone
    );
    return rows[0] ?? null;
  }

  private issueSession(user: UserAuthRow) {
    const accessToken = this.jwtTokenService.signToken({
      sub: user.id,
      role: user.role
    });

    return {
      accessToken,
      user: {
        id: user.id,
        role: user.role,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email
      }
    };
  }
}
