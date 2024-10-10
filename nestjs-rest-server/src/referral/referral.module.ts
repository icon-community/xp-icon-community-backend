import { Module } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { ReferralController } from "./referral.controller";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { DbModule } from "../db/db.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [XpgoConfigModule, DbModule, HttpModule, AuthModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
