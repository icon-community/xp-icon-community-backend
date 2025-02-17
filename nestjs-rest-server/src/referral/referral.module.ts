import { Module } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { ReferralController } from "./referral.controller";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { DbModule } from "../db/db.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
import { REFERRAL_CONTROLLER_CACHE_MS } from "../constants";

@Module({
  imports: [
    CacheModule.register({
      ttl: REFERRAL_CONTROLLER_CACHE_MS, // Cache expiration time in milliseconds
      max: 50, // Maximum number of items in cache
    }),
    XpgoConfigModule,
    DbModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
