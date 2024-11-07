import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DbModule } from "../db/db.module";
import { RankingModule } from "../ranking/ranking.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { ReferralModule } from "../referral/referral.module";
import { ChainConnectorsModule } from "../chain-connectors/chain-connectors.module";

@Module({
  imports: [HttpModule, XpgoConfigModule, DbModule, RankingModule, AuthModule, ReferralModule, ChainConnectorsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
