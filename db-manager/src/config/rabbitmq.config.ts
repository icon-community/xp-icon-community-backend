import { TASKS_TYPES } from "../constants";
export const RABBITMQ_CONFIG = {
  uri: process.env.RABBITMQ_URL ?? "amqp://localhost:5672",
  queues: {
    recurringTasks: TASKS_TYPES.recurringTasks,
    triggeredTasks: TASKS_TYPES.triggeredTasks,
  },
};
