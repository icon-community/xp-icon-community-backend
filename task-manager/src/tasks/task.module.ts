import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { ConfigHelperService } from "../config/config-helper.service";
import {
  ProcessSicxCollateralsTask,
  ProcessAvaxCollateralsTask,
  ProcessCrossChainCollateralsTask,
  ProcessCrossChainLoansTask,
  ProcessSuiCrossChainCollateralsTask,
  ProcessDailyCheckInTask,
  ProcessLoansTask,
  ProcessLockedSavingsTask,
  ProcessNewReferrersTask,
  ProcessNewReferredTask,
} from "./recurring";
import {
  ClickButtonTask,
  SubscribeNewsletterTask,
  FeedTaskSeedToDbTask,
  FeedSeasonSeedToDbTask,
} from "./triggered";
import { TasksModule } from "../collections/tasks/tasks.module";
import { SeasonsModule } from "../collections/seasons/seasons.module";
import { UsersModule } from "../collections/users/users.module";

@Module({
  imports: [TasksModule, SeasonsModule, UsersModule],
  providers: [
    TaskService,
    ClickButtonTask,
    SubscribeNewsletterTask,
    FeedTaskSeedToDbTask,
    FeedSeasonSeedToDbTask,
    ConfigHelperService,
    ProcessSicxCollateralsTask,
    ProcessAvaxCollateralsTask,
    ProcessCrossChainCollateralsTask,
    ProcessCrossChainLoansTask,
    ProcessSuiCrossChainCollateralsTask,
    ProcessDailyCheckInTask,
    ProcessLoansTask,
    ProcessLockedSavingsTask,
    ProcessNewReferrersTask,
    ProcessNewReferredTask,
  ],
  exports: [TaskService],
})
export class TaskModule {}
