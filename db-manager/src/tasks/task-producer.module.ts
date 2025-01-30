import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TaskProducerService } from './task-producer.service';
import { TaskService } from './task.service';
import { ConfigHelperService } from '../config/config-helper.service';
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
} from './recurring';
import {
  SubscribeNewsletterTask,
  ClickButtonTask,
  FeedTaskSeedToDbTask,
  FeedSeasonSeedToDbTask,
} from './triggered';
import { TasksModule } from '../collections/tasks/tasks.module';
import { SeasonsModule } from '../collections/seasons/seasons.module';

@Module({
  imports: [RabbitMQModule, TasksModule, SeasonsModule],
  providers: [
    TaskProducerService,
    TaskService,
    SubscribeNewsletterTask,
    ClickButtonTask,
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
  exports: [TaskProducerService],
})
export class TaskProducerModule {}
