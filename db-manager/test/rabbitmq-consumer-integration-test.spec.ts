// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG } from '../src/config/rabbitmq.config';
import { isTagInLogs } from '../src/utils/utils';

describe('RabbitMQ Consumer Integration Test', () => {
  let connection: amqp.Connection;
  let channel: amqp.Channel;
  const queueName = 'triggered_tasks';

  beforeAll(async () => {
    // Connect to RabbitMQ
    connection = await amqp.connect(RABBITMQ_CONFIG.uri);
    channel = await connection.createChannel();

    // Ensure the queue exists
    await channel.assertQueue(queueName);
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
  });

  it('should send tasks to queue', async () => {
    const task = {
      taskName: 'SUBSCRIBE_NEWSLETTER',
      payload: { tag: Math.random().toString(36).substring(7) },
    };

    // Send a task to the queue
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)));

    // Simulate waiting for the app to process the task
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you should add assertions based on how your app processes the task
    // Example: Check database entries, logs, or any expected side effects
    const check = isTagInLogs(task.payload.tag, '../../logs');
    expect(check).toBe(true);
  });
});
