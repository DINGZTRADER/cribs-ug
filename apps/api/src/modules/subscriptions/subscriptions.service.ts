import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  ActiveSubscriptionDto,
  UnlockPropertyResultDto,
  SubscriptionEntitlements,
  SubscriptionTier
} from "@repo/types";
import { prisma } from "@repo/database";
import {
  canTierUnlockRent,
  PaidTier,
  PLAN_CATALOG,
  requiredTierForRent
} from "./plan-catalog";
import { randomUUID } from "node:crypto";

interface RawSubscriptionRow {
  user_id: string;
  tier: string;
  status: string;
  end_date: Date;
}

interface PropertyUnlockRow {
  id: string;
  rent_amount: number;
  landlord_phone: string;
  landlord_name: string;
}

const db = prisma as {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

@Injectable()
export class SubscriptionsService {
  async getActiveSubscription(userId: string): Promise<ActiveSubscriptionDto> {
    const row = await this.findCurrentSubscription(userId);
    if (!row) {
      return {
        userId,
        tier: "free",
        status: "expired",
        endDate: null
      };
    }

    const tier = this.parseTier(row.tier);
    return {
      userId: row.user_id,
      tier,
      status: row.status === "active" ? "active" : "expired",
      endDate: row.end_date.toISOString()
    };
  }

  async getEntitlements(userId: string): Promise<SubscriptionEntitlements> {
    const active = await this.getActiveSubscription(userId);
    return PLAN_CATALOG[active.tier].entitlements;
  }

  async activatePlan(userId: string, tier: PaidTier): Promise<ActiveSubscriptionDto> {
    const plan = PLAN_CATALOG[tier];
    if (!plan) {
      throw new BadRequestException("Only paid tiers can be activated.");
    }

    const active = await this.findCurrentSubscription(userId);
    const now = new Date();
    const startDate = active ? new Date(active.end_date) : now;
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    await db.$executeRawUnsafe(
      `
      UPDATE subscriptions
      SET status = 'paused'
      WHERE user_id = $1
        AND status = 'active'
        AND end_date > NOW()
      `,
      userId
    );

    await db.$executeRawUnsafe(
      `
      INSERT INTO subscriptions (id, user_id, tier, status, end_date)
      VALUES ($1, $2, $3, 'active', $4)
      `,
      randomUUID(),
      userId,
      tier,
      endDate
    );

    return {
      userId,
      tier,
      status: "active",
      endDate: endDate.toISOString()
    };
  }

  async canUnlockProperty(userId: string, rentAmount: number) {
    const active = await this.getActiveSubscription(userId);
    const requiredTier = requiredTierForRent(rentAmount);

    if (active.tier === "free") {
      return {
        allowed: false as const,
        reason: "no_subscription" as const,
        requiredTier,
        currentTier: "free" as const
      };
    }

    if (!canTierUnlockRent(active.tier, rentAmount)) {
      return {
        allowed: false as const,
        reason: "upgrade_required" as const,
        requiredTier,
        currentTier: active.tier
      };
    }

    return {
      allowed: true as const
    };
  }

  async unlockProperty(userId: string, propertyId: string): Promise<UnlockPropertyResultDto> {
    const rows = await db.$queryRawUnsafe<PropertyUnlockRow[]>(
      `
      SELECT
        p.id,
        p.rent_amount,
        u.phone AS landlord_phone,
        u.full_name AS landlord_name
      FROM properties p
      JOIN users u ON u.id = p.landlord_id
      WHERE p.id = $1
        AND p.status = 'active'
      LIMIT 1
      `,
      propertyId
    );

    const property = rows[0];
    if (!property) {
      throw new NotFoundException("Property not found.");
    }

    const access = await this.canUnlockProperty(userId, property.rent_amount);
    if (!access.allowed) {
      const currentTierName =
        access.currentTier === "free" ? "no active plan" : PLAN_CATALOG[access.currentTier].name;
      return {
        allowed: false,
        message:
          access.reason === "no_subscription"
            ? "You need a subscription to reveal landlord contact details."
            : `This listing is above your current tier limit (${currentTierName}).`,
        upsell: {
          recommendedTier: access.requiredTier
        }
      };
    }

    return {
      allowed: true,
      landlordPhone: property.landlord_phone,
      landlordName: property.landlord_name,
      safetyWarning: "Do not pay any money before viewing the property in person."
    };
  }

  private async findCurrentSubscription(userId: string): Promise<RawSubscriptionRow | null> {
    const rows = await db.$queryRawUnsafe<RawSubscriptionRow[]>(
      `
      SELECT user_id, tier, status, end_date
      FROM subscriptions
      WHERE user_id = $1
        AND status = 'active'
        AND end_date > NOW()
      ORDER BY end_date DESC
      LIMIT 1
      `,
      userId
    );
    return rows[0] ?? null;
  }

  private parseTier(tier: string): SubscriptionTier {
    if (tier === "budget" || tier === "family" || tier === "premium") {
      return tier;
    }
    return "free";
  }
}
