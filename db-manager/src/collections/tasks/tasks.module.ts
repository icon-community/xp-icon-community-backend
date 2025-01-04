import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskSchema } from './schemas/tasks.schema';
import MONGO_CONFIG from '../../config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MONGO_CONFIG.collections.tasks, schema: TaskSchema },
    ]),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
