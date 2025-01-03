import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { TaskProducerModule } from './tasks/task-producer.module';
import { TaskConsumerModule } from './tasks/task-consumer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMQModule,
    TaskProducerModule,
    TaskConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
