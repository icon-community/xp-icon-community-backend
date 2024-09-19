import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/User.schema";
import { UserTask, UserTaskSchema } from "./schemas/UserTask.schema";
import { Season, SeasonsSchema } from "./schemas/Seasons.schema";
import { Task, TaskSchema } from "./schemas/Task.schema";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { SeasonDbService } from "./services/users-db/season-db.service";
import { TaskDbService } from "./services/users-db/task-db.service";
import { UsersTaskDbService } from "./services/users-db/user-task-db.service";
import { UsersDbService } from "./services/users-db/users-db.service";

@Module({
  imports: [
    XpgoConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserTask.name,
        schema: UserTaskSchema,
      },
      {
        name: Season.name,
        schema: SeasonsSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [SeasonDbService, TaskDbService, UsersTaskDbService, UsersDbService],
  exports: [SeasonDbService, TaskDbService, UsersTaskDbService, UsersDbService],
})
export class DbModule {}
