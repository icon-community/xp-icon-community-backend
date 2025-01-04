import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskSchema } from './schemas/tasks.schema';
import { TASKS_MODEL } from '../../constants';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TASKS_MODEL, schema: TaskSchema }]),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
