import { SubscriptionEntitlements, SubscriptionTier } from "@repo/types";

export type PaidTier = Exclude<SubscriptionTier, "free">;

export interface PlanDefinition {
  tier: SubscriptionTier;
  name: string;
  description: string;
  durationDays: number;
  priceMinorUnits: number;
  maxRentAmount: number;
  entitlements: SubscriptionEntitlements;
}

export const PLAN_CATALOG: Record<SubscriptionTier, PlanDefinition> = {
  free: {
    tier: "free",
    name: "Free Explorer",
    description: "Browse listings with limited radius and locked contact info.",
    durationDays: 0,
    priceMinorUnits: 0,
    maxRentAmount: 0,
    entitlements: {
      tier: "free",
      maxRadiusMeters: 3000,
      canRevealLandlordPhone: false,
      canAccessPriorityMatches: false,
      canScheduleGuidedVisits: false
    }
  },
  budget: {
    tier: "budget",
    name: "Budget Tier",
    description: "Entry access for lower-rent homes and direct contacts.",
    durationDays: 30,
    priceMinorUnits: 10000,
    maxRentAmount: 500000,
    entitlements: {
      tier: "budget",
      maxRadiusMeters: 7000,
      canRevealLandlordPhone: true,
      canAccessPriorityMatches: false,
      canScheduleGuidedVisits: false
    }
  },
  family: {
    tier: "family",
    name: "Family Saver",
    description: "Broader discovery and higher rent unlock threshold.",
    durationDays: 30,
    priceMinorUnits: 25000,
    maxRentAmount: 1000000,
    entitlements: {
      tier: "family",
      maxRadiusMeters: 12000,
      canRevealLandlordPhone: true,
      canAccessPriorityMatches: true,
      canScheduleGuidedVisits: false
    }
  },
  premium: {
    tier: "premium",
    name: "Premium Flex",
    description: "Full unlock coverage across all rent ranges.",
    durationDays: 30,
    priceMinorUnits: 50000,
    maxRentAmount: Number.MAX_SAFE_INTEGER,
    entitlements: {
      tier: "premium",
      maxRadiusMeters: 25000,
      canRevealLandlordPhone: true,
      canAccessPriorityMatches: true,
      canScheduleGuidedVisits: true
    }
  }
};

export function requiredTierForRent(rentAmount: number): PaidTier {
  if (rentAmount <= PLAN_CATALOG.budget.maxRentAmount) {
    return "budget";
  }
  if (rentAmount <= PLAN_CATALOG.family.maxRentAmount) {
    return "family";
  }
  return "premium";
}

export function canTierUnlockRent(tier: SubscriptionTier, rentAmount: number): boolean {
  if (tier === "free") {
    return false;
  }
  return PLAN_CATALOG[tier].maxRentAmount >= rentAmount;
}
