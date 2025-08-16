import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserSchema } from "./schemas/users.schema";
import MONGO_CONFIG from "../../config/mongo.config";
import { MongooseModule } from "@nestjs/mongoose";
import { SeasonsModule } from "../seasons/seasons.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MONGO_CONFIG.collections.users, schema: UserSchema },
    ]),
    SeasonsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
