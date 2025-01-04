import { Connection } from 'mongoose';
import { TaskSchema } from './schemas/tasks.schema';
import { TASKS_MODEL, DB_CONNECTION } from '../../constants';
import MONGO_CONFIG from '../../config/mongo.config';

export const tasksProviders = [
  {
    provide: TASKS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(MONGO_CONFIG.collections.tasks, TaskSchema),
    inject: [DB_CONNECTION],
  },
];
