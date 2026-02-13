import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";
import { JwtPayload, RequestUser } from "./jwt-payload";

@Injectable()
export class JwtTokenService {
  signToken(payload: { sub: string; role?: string }, expiresInSeconds = 60 * 60 * 24 * 30): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException("JWT secret is not configured.");
    }

    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const body: JwtPayload = {
      sub: payload.sub,
      role: payload.role,
      iat: now,
      exp: now + expiresInSeconds
    };

    const encodedHeader = this.base64UrlEncodeJson(header);
    const encodedPayload = this.base64UrlEncodeJson(body);
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = createHmac("sha256", secret).update(data).digest("base64url");
    return `${data}.${signature}`;
  }

  verifyAuthorizationHeader(authorization?: string): RequestUser {
    const token = this.extractBearerToken(authorization);
    if (!token) {
      throw new UnauthorizedException("Missing Bearer token.");
    }
    return this.verifyToken(token);
  }

  verifyToken(token: string): RequestUser {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new UnauthorizedException("Invalid JWT format.");
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException("JWT secret is not configured.");
    }

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", secret)
      .update(data)
      .digest("base64url");

    const isMatch = this.safeCompare(expectedSignature, encodedSignature);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid JWT signature.");
    }

    const payload = this.decodePayload(encodedPayload);
    if (!payload.sub) {
      throw new UnauthorizedException("JWT payload is missing subject.");
    }
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      throw new UnauthorizedException("JWT has expired.");
    }

    return { id: payload.sub, role: payload.role };
  }

  tryVerifyToken(token?: string): RequestUser | null {
    if (!token) {
      return null;
    }
    try {
      return this.verifyToken(token);
    } catch {
      return null;
    }
  }

  private extractBearerToken(authorization?: string): string | null {
    if (!authorization) {
      return null;
    }
    const [scheme, token] = authorization.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return null;
    }
    return token;
  }

  private decodePayload(encodedPayload: string): JwtPayload {
    try {
      const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
      return JSON.parse(payloadJson) as JwtPayload;
    } catch {
      throw new UnauthorizedException("Invalid JWT payload.");
    }
  }

  private safeCompare(a: string, b: string): boolean {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) {
      return false;
    }
    return timingSafeEqual(aBuf, bBuf);
  }

  private base64UrlEncodeJson(value: unknown): string {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  }
}
