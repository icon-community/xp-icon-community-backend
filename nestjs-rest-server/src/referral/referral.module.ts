import { Module } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { ReferralController } from "./referral.controller";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [XpgoConfigModule, DbModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
