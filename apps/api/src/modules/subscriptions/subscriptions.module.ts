import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import { JwtTokenService } from "../../common/auth/jwt-token.service";
import { SubscriptionAccessService } from "./subscription-access.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
  providers: [
    SubscriptionsService,
    SubscriptionAccessService,
    JwtTokenService,
    JwtAuthGuard
  ],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService, SubscriptionAccessService, JwtTokenService, JwtAuthGuard]
})
export class SubscriptionsModule {}
