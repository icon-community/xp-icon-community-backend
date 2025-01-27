import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.config';
import { Logger } from '@nestjs/common';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private logger: Logger;
  private paused: boolean;
  private taskThatPaused: string | null;

  constructor() {
    this.logger = new Logger(RabbitMQService.name);
    this.paused = false;
    this.taskThatPaused = null;
  }

  setPaused = (pause: boolean) => {
    this.paused = pause;
    if (!pause) {
      this.taskThatPaused = null;
    }
  };

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

  async sendToQueue(queue: string, message: any, pause = false) {
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
      if (pause && this.taskThatPaused == null) {
        this.logger.log({
          level: 'info',
          message: `Pausing all queue consumption`,
        });
        this.paused = true;
        this.taskThatPaused = JSON.stringify(message);
      }
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error sending message to queue',
        error: err,
      });
    }
  }

  async consume(queue: string, callback: (msg: any, setPaused: any) => void) {
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

          if (this.paused) {
            this.logger.log({
              level: 'info',
              message: `Queue consumption paused. Task that paused: ${this.taskThatPaused}`,
            });
            if (this.taskThatPaused !== msg.content.toString()) {
              // if this is not the message that paused
              // the queue consumption we send the message
              // back to the queue
              this.channel.nack(msg, false, true);
              this.logger.log({
                level: 'info',
                message: `Message not consumed. Message: ${msg.content.toString()}`,
              });
            } else {
              this.logger.log({
                level: 'info',
                message: `Consuming message that paused queue consumption. Message: ${msg.content.toString()}`,
              });
              try {
                // if this next line fails the queue
                // consumption should not be paused
                // indefinitely because we wrapped the
                // following logic in a try-catch block
                callback(JSON.parse(msg.content.toString()), this.setPaused);
                this.channel.ack(msg);
                this.logger.log({
                  level: 'info',
                  message: `Message consumed from queue ${queue}. Message: ${msg.content.toString()}`,
                });
              } catch (internalError) {
                this.logger.log({
                  level: 'error',
                  message: `Error executing callback for message. Message: ${msg.content.toString()}`,
                  error: internalError,
                });
              }

              // to avoid halting the queue consumption
              // when executing the callback of the message
              // that paused the queue consumption
              // the previous logic has been wrapped in a
              // try-catch block
              // and in the following lines we unpause
              // the queue consumption
              // otherwise the callback execution failing
              // will result on the queue consumption to
              // be paused indefinitely
              // this.logger.log({
              //   level: 'info',
              //   message: `Unpausing queue consumption`,
              // });
            }
          } else {
            callback(JSON.parse(msg.content.toString()), this.setPaused);
            this.channel.ack(msg);
            this.logger.log({
              level: 'info',
              message: `Message consumed from queue ${queue}. Message: ${msg.content.toString()}`,
            });
          }
        } catch (callbackError) {
          this.logger.log({
            level: 'error',
            message: 'Error consuming message from queue',
            error: callbackError,
          });
          this.channel.nack(msg, false, false);
        }
      });
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error consuming message from queue',
        error: err,
      });
    }
  }

  triggeredQueueStatus = async () => {
    try {
      if (!this.channel) {
        throw new Error('Channel not created');
      }

      return await this.channel.checkQueue(
        RABBITMQ_CONFIG.queues.triggeredTasks,
      );
    } catch (err) {
      this.logger.error({
        level: 'error',
        message: 'Error checking triggeredTasks queue status',
        error: err,
      });
    }
  };

  // Example of how to use the triggeredQueueStatus method
  // async waitForTriggeredQueueToEmpty() {
  //   try {
  //     const triggeredQueueStatus = await this.triggeredQueueStatus();

  //     while (triggeredQueueStatus.messageCount > 0) {
  //       this.logger.log({
  //         level: 'info',
  //         message: `Waiting for ${RABBITMQ_CONFIG.queues.triggeredTasks} queue to empty`,
  //       });
  //       await new Promise((resolve) => setTimeout(resolve, 3000));
  //     }
  //   } catch (err) {
  //     this.logger.error({
  //       level: 'error',
  //       message: 'Error waiting for triggeredTasks queue to empty',
  //       error: err,
  //     });
  //   }
  // }
}
