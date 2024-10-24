import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/User.schema";
import { UserTaskSchema } from "./schemas/UserTask.schema";
import { SeasonsSchema } from "./schemas/Seasons.schema";
import { TaskSchema } from "./schemas/Task.schema";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { SeasonDbService } from "./services/users-db/season-db.service";
import { TaskDbService } from "./services/users-db/task-db.service";
import { UsersTaskDbService } from "./services/users-db/user-task-db.service";
import { UsersDbService } from "./services/users-db/users-db.service";
import { ReferralDbService } from "./services/users-db/referral-db.service";
import { ReferralSchema } from "./schemas/Referral.schema";
import { Collections } from "../shared/models/enum/Collections";

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
    ]),
  ],
  providers: [SeasonDbService, TaskDbService, UsersTaskDbService, UsersDbService, ReferralDbService],
  exports: [SeasonDbService, TaskDbService, UsersTaskDbService, UsersDbService, ReferralDbService],
})
export class DbModule {}
