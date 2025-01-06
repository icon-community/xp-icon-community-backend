import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  ProcessNewUserRewardsTask,
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
} from './recurring';
import {
  SubscribeNewsletterTask,
  ClickButtonTask,
  FeedTaskSeedToDbTask,
  FeedSeasonSeedToDbTask,
} from './triggered';
import { TRIGGERED_TASKS_TYPES } from '../constants';
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    // recurring tasks
    private readonly processNewUserRewardsTask: ProcessNewUserRewardsTask,
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
    private readonly clickButtonTask: ClickButtonTask,
    private readonly feedTaskSeedToDbTask: FeedTaskSeedToDbTask,
    private readonly feedSeasonSeedToDbTask: FeedSeasonSeedToDbTask,
  ) {}

  executeRecurringTasks({ blockHeight }: { blockHeight: number }) {
    const recurringTasks = [
      this.processNewUserRewardsTask,
      this.processSicxCollateralsTask,
      this.processAvaxCollateralsTask,
      this.processCrossChainCollateralsTask,
      this.processCrossChainLoansTask,
      this.processSuiCrossChainCollateralsTask,
      this.processDailyCheckInTask,
      this.processLoansTask,
      this.processLockedSavingsTask,
      this.processNewReferrersTask,
      this.processNewReferredTask,
    ];
    for (const task of recurringTasks) {
      try {
        this.logger.log({
          level: 'info',
          message: `Executing task: ${task.constructor.name}`,
        });
        task.execute({ blockHeight });
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Error executing task: ${task.constructor.name}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }

  executeTriggeredTasks(taskName: string, callbackSetPaused: () => void) {
    const triggeredTasks = [
      {
        label: TRIGGERED_TASKS_TYPES.subscribeNewsletter,
        callback: this.subscribeNewsletterTask,
        params: [callbackSetPaused],
      },
      {
        label: TRIGGERED_TASKS_TYPES.clickButton,
        callback: this.clickButtonTask,
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
        level: 'error',
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
            level: 'info',
            message: `Executing task: ${task.label}`,
          });

          task.callback.execute(...task.params);
          break;
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Error executing task: ${task}. Message: ${err.message}`,
          error: err,
        });
      }
    }
  }
}
