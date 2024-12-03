import { Module } from "@nestjs/common";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { DbModule } from "../db/db.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { DailyCheckInController } from "./daily-check-in.controller";
import { DailyCheckInService } from "./daily-check-in.service";

@Module({
  imports: [XpgoConfigModule, DbModule, HttpModule, AuthModule],
  controllers: [DailyCheckInController],
  providers: [DailyCheckInService],
  exports: [DailyCheckInService],
})
export class DailyCheckInModule {}
