import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./config/env.validation";
import { AuthModule } from "./modules/auth/auth.module";
import { DevModule } from "./modules/dev/dev.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { SearchModule } from "./modules/search/search.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";

const isProduction = (process.env.NODE_ENV || "").toLowerCase() === "production";
const allowDevEndpoints = process.env.ENABLE_DEV_ENDPOINTS === "1";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    AuthModule,
    ...(!isProduction && allowDevEndpoints ? [DevModule] : []),
    SearchModule,
    SubscriptionsModule,
    PaymentsModule
  ]
})
export class AppModule {}
