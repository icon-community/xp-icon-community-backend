import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTasksService } from './user-tasks.service';
import { UserTaskSchema } from './schemas/user-tasks.schema';
import MONGO_CONFIG from '../../config/mongo.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MONGO_CONFIG.collections.userTasks,
        schema: UserTaskSchema,
      },
    ]),
  ],
  providers: [UserTasksService],
  exports: [UserTasksService],
})
export class UserTasksModule {}
