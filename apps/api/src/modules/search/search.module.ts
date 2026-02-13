import { Module } from "@nestjs/common";
import { JwtTokenService } from "../../common/auth/jwt-token.service";
import { OptionalJwtAuthGuard } from "../../common/auth/optional-jwt-auth.guard";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [SubscriptionsModule],
  providers: [SearchService, JwtTokenService, OptionalJwtAuthGuard],
  controllers: [SearchController]
})
export class SearchModule {}
