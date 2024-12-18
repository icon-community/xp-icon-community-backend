import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { SeasonModule } from "../season/season.module";
import { XpgoConfigModule } from "../config/xpgo-config.module";
import { DbModule } from "../db/db.module";
import { AuthModule } from "../auth/auth.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [AuthModule, SeasonModule, XpgoConfigModule, DbModule, HttpModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
