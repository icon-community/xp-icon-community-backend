import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { TaskInput } from "../shared/types/GeneralTypes";
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
  SubscribeNewsletterTask,
  FeedTaskSeedToDbTask,
  FeedSeasonSeedToDbTask,
} from "./triggered";
import { TRIGGERED_TASKS_TYPES } from "../constants";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    // recurring tasks
    private readonly processSicxCollateralsTask: ProcessSicxCollateralsTask,
    private readonly processAvaxCollateralsTask: ProcessAvaxCollateralsTask,
    private readonly processCrossChainCollateralsTask: ProcessCrossChainCollateralsTask,
    private readonly processCrossChainLoansTask: ProcessCrossChainLoansTask,
    private readonly processSuiCrossChainCollateralsTask: ProcessSuiCrossChainCollateralsTask,
    private readonly processDailyCheckInTask: ProcessDailyCheckInTask,
    private readonly processLoansTask: ProcessLoansTask,
    private readonly processLockedSavingsTask: ProcessLockedSavingsTask,
    private readonly processNewReferrersTask: ProcessNewReferrersTask,
    private readonly processNewReferredTask: ProcessNewReferredTask,

    // triggered tasks
    private readonly subscribeNewsletterTask: SubscribeNewsletterTask,
    private readonly feedTaskSeedToDbTask: FeedTaskSeedToDbTask,
    private readonly feedSeasonSeedToDbTask: FeedSeasonSeedToDbTask,
  ) {}

  async executeInitTasks() {
    async function dummy() {}
    const tasks = [
      {
        label: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
        callback: this.feedTaskSeedToDbTask,
        params: [false, dummy],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
        callback: this.feedSeasonSeedToDbTask,
        params: [false, dummy],
      },
    ];
    for (const task of tasks) {
      try {
        this.logger.log({
          level: "info",
          message: `Executing task: ${task.label}`,
        });

        await task.callback.execute(...task.params);
      } catch (err) {
        this.logger.log({
          level: "error",
          message: `Error executing task: ${task}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }

  async executeRecurringTasks(taskInput: TaskInput) {
    const recurringTasks = [
      this.processAvaxCollateralsTask,
      this.processCrossChainCollateralsTask,
      this.processCrossChainLoansTask,
      this.processDailyCheckInTask,
      this.processLoansTask,
      this.processLockedSavingsTask,
      this.processNewReferredTask,
      this.processNewReferrersTask,
      this.processSicxCollateralsTask,
      this.processSuiCrossChainCollateralsTask,
    ];
    for (const task of recurringTasks) {
      await task.execute(taskInput);
    }
  }

  async executeTriggeredTasks(taskName: string, callbackSetPaused: () => void) {
    const triggeredTasks = [
      {
        label: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
        callback: this.subscribeNewsletterTask,
        params: [callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedTaskSeedToDbForce,
        callback: this.feedTaskSeedToDbTask,
        params: [true, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedTaskSeedToDb,
        callback: this.feedTaskSeedToDbTask,
        params: [false, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDb,
        callback: this.feedSeasonSeedToDbTask,
        params: [false, callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.feedSeasonSeedToDbForce,
        callback: this.feedSeasonSeedToDbTask,
        params: [true, callbackSetPaused],
      },
    ];

    if (!triggeredTasks.some((item) => item.label === taskName)) {
      this.logger.log({
        level: "error",
        message: `Unknown triggered task: ${taskName}`,
      });
      return;
    }

    for (const task of triggeredTasks) {
      try {
        if (task.label !== taskName) {
          continue;
        } else {
          this.logger.log({
            level: "info",
            message: `Executing task: ${task.label}`,
          });

          await task.callback.execute(...task.params);
          break;
        }
      } catch (err) {
        this.logger.log({
          level: "error",
          message: `Error executing task: ${task}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }
}
