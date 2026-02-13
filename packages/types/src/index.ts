export interface CreatePropertyDto {
  title: string;
  rent_amount: number;
  district: string;
  latitude: number;
  longitude: number;
}

export interface SearchResponseDto {
  id: string;
  title: string;
  thumbnail_url: string;
  rent_amount: number;
  landlord: {
    badge_score: number;
    verified: boolean;
  };
}

export type SubscriptionTier = "free" | "budget" | "family" | "premium";

export interface SubscriptionEntitlements {
  tier: SubscriptionTier;
  maxRadiusMeters: number;
  canRevealLandlordPhone: boolean;
  canAccessPriorityMatches: boolean;
  canScheduleGuidedVisits: boolean;
}

export interface ActiveSubscriptionDto {
  userId: string;
  tier: SubscriptionTier;
  status: "active" | "paused" | "expired";
  endDate: string | null;
}

export interface ActivateSubscriptionDto {
  userId: string;
  tier: Exclude<SubscriptionTier, "free">;
}

export interface PaymentWebhookDto {
  event: "payment.success" | "payment.failed";
  transactionId: string;
  userId: string;
  tier: Exclude<SubscriptionTier, "free">;
  amount: number;
  currency: string;
}

export interface UnlockPropertyResultDto {
  allowed: boolean;
  message?: string;
  landlordPhone?: string | null;
  landlordName?: string;
  safetyWarning?: string;
  upsell?: {
    recommendedTier: Exclude<SubscriptionTier, "free">;
  };
}
