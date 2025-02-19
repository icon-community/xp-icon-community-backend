import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserSchema } from "./schemas/users.schema";
import { UserController } from "./users.controller";
import MONGO_CONFIG from "../../config/mongo.config";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonsModule } from "../seasons/seasons.module";
import { TaskProducerModule } from "../../tasks/task-producer.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MONGO_CONFIG.collections.users, schema: UserSchema },
    ]),
    SeasonsModule,
    TaskProducerModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
