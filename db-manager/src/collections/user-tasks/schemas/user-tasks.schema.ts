import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import MONGO_CONFIG from "../../../config/mongo.config";
import { UserTaskStatus } from "../../../shared/enum/general-enum";

export interface UserTaskResponse extends UserTaskDocument {
  _id: Types.ObjectId;
}

@Schema()
export class XpEarned {
  @Prop({
    type: Number,
    required: [true, "Please specify field"],
  })
  xp: number;

  @Prop({
    type: Number,
    required: [true, "Please specify field"],
  })
  block: number;

  @Prop({
    type: Number,
    required: [true, "Please specify field"],
  })
  period: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
  })
  details?: any;
}

export type UserTaskDocument = UserTask & Document;

@Schema({
  timestamps: true, // This will automatically handle createdAt
})
export class UserTask {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: [true, "Please specify field"],
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Task",
    required: [true, "Please specify field"],
  })
  taskId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Season",
    required: [true, "Please specify field"],
  })
  seasonId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(UserTaskStatus),
    default: UserTaskStatus.PENDING,
  })
  status: UserTaskStatus;

  @Prop({
    type: String,
    required: [true, "Please specify field"],
  })
  walletAddress: string;

  @Prop({
    type: [XpEarned],
    default: [],
  })
  xpEarned: XpEarned[];
}

export const UserTaskSchema = SchemaFactory.createForClass(UserTask);
UserTaskSchema.set("collection", MONGO_CONFIG.collections.userTasks);
