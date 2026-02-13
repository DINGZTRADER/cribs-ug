import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import { RequestUser } from "../../common/auth/jwt-payload";
import { validateOrThrow } from "../../common/validation/validate-or-throw";
import { SubscriptionAccessService, SubscriptionFeature } from "./subscription-access.service";
import { PLAN_CATALOG, PaidTier } from "./plan-catalog";
import {
  activateSubscriptionSchema,
  featureQuerySchema,
  unlockPropertyParamsSchema
} from "./subscriptions.schemas";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly subscriptionAccessService: SubscriptionAccessService
  ) {}

  @Get("plans")
  listPlans() {
    return Object.values(PLAN_CATALOG);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getCurrentSubscription(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getActiveSubscription(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/entitlements")
  getEntitlements(@CurrentUser() user: RequestUser) {
    return this.subscriptionsService.getEntitlements(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("activate")
  activateSubscription(
    @CurrentUser() user: RequestUser,
    @Body() body: unknown
  ) {
    const parsed = validateOrThrow(
      activateSubscriptionSchema,
      body,
      "Invalid subscription activation payload."
    );
    return this.subscriptionsService.activatePlan(user.id, parsed.tier as PaidTier);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/access")
  async checkFeatureAccess(
    @CurrentUser() user: RequestUser,
    @Query("feature") feature: string
  ) {
    const parsed = validateOrThrow(
      featureQuerySchema,
      { feature },
      "Invalid feature query."
    );
    await this.subscriptionAccessService.assertFeatureAccess(
      user.id,
      parsed.feature as SubscriptionFeature
    );
    return { allowed: true, feature: parsed.feature };
  }

  @UseGuards(JwtAuthGuard)
  @Get("unlock/:propertyId")
  unlockProperty(@CurrentUser() user: RequestUser, @Param() params: Record<string, unknown>) {
    const parsed = validateOrThrow(
      unlockPropertyParamsSchema,
      params,
      "Invalid property id."
    );
    return this.subscriptionsService.unlockProperty(user.id, parsed.propertyId);
  }
}
