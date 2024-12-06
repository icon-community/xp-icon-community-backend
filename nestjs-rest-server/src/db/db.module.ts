import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/User.schema";
import { UserTaskSchema } from "./schemas/UserTask.schema";
import { SeasonsSchema } from "./schemas/Seasons.schema";
import { TaskSchema } from "./schemas/Task.schema";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { SeasonDbService } from "./services/season-db.service";
import { TaskDbService } from "./services/task-db.service";
import { UsersTaskDbService } from "./services/user-task-db.service";
import { UsersDbService } from "./services/users-db.service";
import { ReferralDbService } from "./services/referral-db.service";
import { ReferralSchema } from "./schemas/Referral.schema";
import { Collections } from "../shared/models/enum/Collections";
import { DailyCheckInSchema } from "./schemas/DailyCheckIn.schema";
import { DailyCheckInDbService } from "./services/daily-check-in-db.service";

@Module({
  imports: [
    XpgoConfigModule,
    MongooseModule.forFeature([
      {
        name: Collections.USERS,
        schema: UserSchema,
      },
      {
        name: Collections.USER_TASKS,
        schema: UserTaskSchema,
      },
      {
        name: Collections.SEASONS,
        schema: SeasonsSchema,
      },
      {
        name: Collections.TASKS,
        schema: TaskSchema,
      },
      {
        name: Collections.REFERRALS,
        schema: ReferralSchema,
      },
      {
        name: Collections.DAILY_CHECK_IN,
        schema: DailyCheckInSchema,
      },
    ]),
  ],
  providers: [
    SeasonDbService,
    TaskDbService,
    UsersTaskDbService,
    UsersDbService,
    ReferralDbService,
    DailyCheckInDbService,
  ],
  exports: [
    SeasonDbService,
    TaskDbService,
    UsersTaskDbService,
    UsersDbService,
    ReferralDbService,
    DailyCheckInDbService,
  ],
})
export class DbModule {}
