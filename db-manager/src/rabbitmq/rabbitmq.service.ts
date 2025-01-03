import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config';
import { Logger } from '@nestjs/common';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private logger = new Logger('RabbitMQService');

  async onModuleInit() {
    try {
      this.logger.log({
        level: 'info',
        message: 'Connecting to RabbitMQ',
      });
      this.connection = await amqp.connect(RABBITMQ_CONFIG.uri);
      this.logger.log({
        level: 'info',
        message: 'Connected to RabbitMQ',
      });
      this.channel = await this.connection.createChannel();
      this.logger.log({
        level: 'info',
        message: 'Channel created',
      });
      for (const queueName of Object.values(RABBITMQ_CONFIG.queues)) {
        await this.channel.assertQueue(queueName);
        this.logger.log({
          level: 'info',
          message: `Queue ${queueName} asserted`,
        });
      }
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error connecting to RabbitMQ',
        error: err,
      });

      if (this.connection) {
        this.connection.close();
        this.logger.log({
          level: 'info',
          message: 'Connection closed',
        });
      }
    }
  }

  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        throw new Error('Channel not created');
      }
      const sent = this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
      );
      if (!sent) {
        throw new Error(`Failure sending message to queue ${queue}`);
      }
      this.logger.log({
        level: 'info',
        message: `Message sent to queue ${queue}. Message: ${JSON.stringify(message)}`,
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error sending message to queue',
        error: err,
      });
    }
  }

  async consume(queue: string, callback: (msg: any) => void) {
    try {
      if (!this.channel) {
        throw new Error('Channel not created');
      }
      this.channel.consume(queue, (msg) => {
        try {
          if (!msg) {
            this.logger.log({
              level: 'info',
              message: `No message in queue ${queue}`,
            });
            return;
          }
          callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
          this.logger.log({
            level: 'info',
            message: `Message consumed from queue ${queue}. Message: ${msg.content.toString()}`,
          });
        } catch (callbackError) {
          this.logger.log({
            level: 'error',
            message: 'Error consuming message from queue',
            error: callbackError,
          });
          this.channel.nack(msg, false, false);
        }
      });

      this.logger.log({
        level: 'info',
        message: `Consuming messages from queue ${queue}`,
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error consuming message from queue',
        error: err,
      });
    }
  }
}
