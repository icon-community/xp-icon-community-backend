import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReferralsService } from "./referrals.service";
import { Referral, ReferralSchema } from "./schemas/referrals.schema";
import MONGO_CONFIG from "../../config/mongo.config";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MONGO_CONFIG.collections.referrals,
        schema: ReferralSchema,
      },
    ]),
  ],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
