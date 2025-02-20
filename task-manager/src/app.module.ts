import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";
import { TaskProducerModule } from "./tasks/task-producer.module";
import { TaskConsumerModule } from "./tasks/task-consumer.module";
import { UsersModule } from "./collections/users/users.module";
import { SeasonsModule } from "./collections/seasons/seasons.module";
import { AppController, UserController } from "./app.controller";
import { AppService } from "./app.service";
import MONGO_CONFIG from "./config/mongo.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MONGO_CONFIG.uri),
    RabbitMQModule,
    TaskProducerModule,
    TaskConsumerModule,
    UsersModule,
    SeasonsModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
