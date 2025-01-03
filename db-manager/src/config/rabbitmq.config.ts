export const RABBITMQ_CONFIG = {
  uri: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  queues: {
    recurringTasks: 'recurring_tasks',
    triggeredTasks: 'triggered_tasks',
  },
};
