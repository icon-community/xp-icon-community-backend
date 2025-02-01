import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema()
class XpEarned {
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
  details: any;
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
    enum: ["pending", "completed", "failed"],
    default: "pending",
  })
  status: "pending" | "completed" | "failed";

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
