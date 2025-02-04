import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Chains } from "../../../shared/enum/general-enum";
import MONGO_CONFIG from "../../../config/mongo.config";

export type TaskDocument = Task & Document;
export interface TaskResponse extends TaskDocument {
  _id: Types.ObjectId;
}

export class Task {
  @Prop({ required: true })
  seedId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  criteria: MongooseSchema.Types.Mixed;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  rewardFormula: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, enum: Chains })
  chain: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set("collection", MONGO_CONFIG.collections.tasks);
