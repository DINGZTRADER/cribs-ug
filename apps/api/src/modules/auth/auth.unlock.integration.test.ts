import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "@repo/database";
import { JwtTokenService } from "../../common/auth/jwt-token.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { AuthService } from "./auth.service";

type DbClient = {
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

const db = prisma as unknown as DbClient;

const runIntegration = process.env.RUN_INTEGRATION_TESTS === "1";

test("register -> login -> unlock flow returns gated upsell for free user", { skip: !runIntegration }, async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "integration_test_secret";

  const authService = new AuthService(new JwtTokenService());
  const subscriptionsService = new SubscriptionsService();

  const tenantPhone = `+256704${Math.floor(100000 + Math.random() * 899999)}`;
  const tenantEmail = `integ.${Date.now()}@example.com`;
  const password = "Passw0rd!123";

  const landlordId = randomUUID();
  const propertyId = randomUUID();

  try {
    const registered = await authService.register({
      fullName: "Integration Tenant",
      phone: tenantPhone,
      email: tenantEmail,
      password,
      role: "tenant"
    });
    assert.ok(registered.accessToken);
    assert.ok(registered.user.id);

    const login = await authService.login({
      phone: tenantPhone,
      password
    });
    assert.ok(login.accessToken);
    assert.equal(login.user.phone, tenantPhone);

    await db.$executeRawUnsafe(
      `
      INSERT INTO users (
        id, role, full_name, phone, email, password_hash, badge_score, is_identity_verified, created_at
      )
      VALUES ($1, 'landlord'::"Role", $2, $3, $4, NULL, 50, true, NOW())
      `,
      landlordId,
      "Integration Landlord",
      `+256700${Math.floor(100000 + Math.random() * 899999)}`,
      `landlord.${Date.now()}@example.com`
    );
    await db.$executeRawUnsafe(
      `
      INSERT INTO landlord_profiles (user_id, verified_owner)
      VALUES ($1, true)
      `,
      landlordId
    );
    await db.$executeRawUnsafe(
      `
      INSERT INTO properties (
        id, landlord_id, title, rent_amount, district, latitude, longitude, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      `,
      propertyId,
      landlordId,
      "Integration Test Flat",
      450000,
      "Kampala",
      0.3476,
      32.5825
    );

    const unlock = await subscriptionsService.unlockProperty(registered.user.id, propertyId);
    assert.equal(unlock.allowed, false);
    assert.equal(unlock.upsell?.recommendedTier, "budget");
  } finally {
    await db.$executeRawUnsafe(`DELETE FROM properties WHERE id = $1`, propertyId);
    await db.$executeRawUnsafe(`DELETE FROM landlord_profiles WHERE user_id = $1`, landlordId);
    await db.$executeRawUnsafe(`DELETE FROM users WHERE id = $1`, landlordId);

    await db.$executeRawUnsafe(`DELETE FROM tenant_profiles WHERE user_id IN (SELECT id FROM users WHERE phone = $1)`, tenantPhone);
    await db.$executeRawUnsafe(`DELETE FROM users WHERE phone = $1`, tenantPhone);
  }
});
