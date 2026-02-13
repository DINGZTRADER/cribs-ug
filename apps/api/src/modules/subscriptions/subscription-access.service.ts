import { ForbiddenException, Injectable } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";

export type SubscriptionFeature =
  | "contact_reveal"
  | "priority_matches"
  | "guided_visits";

@Injectable()
export class SubscriptionAccessService {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async assertFeatureAccess(userId: string, feature: SubscriptionFeature): Promise<void> {
    const entitlements = await this.subscriptionsService.getEntitlements(userId);

    const hasAccess =
      (feature === "contact_reveal" && entitlements.canRevealLandlordPhone) ||
      (feature === "priority_matches" && entitlements.canAccessPriorityMatches) ||
      (feature === "guided_visits" && entitlements.canScheduleGuidedVisits);

    if (!hasAccess) {
      throw new ForbiddenException(`Feature '${feature}' requires a higher subscription tier.`);
    }
  }
}
