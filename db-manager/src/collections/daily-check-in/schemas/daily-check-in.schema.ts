import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import MONGO_CONFIG from "../../../config/mongo.config";

export type DailyCheckInDocument = DailyCheckIn & Document;
export interface DailyCheckInResponse extends DailyCheckIn {
  _id: Types.ObjectId;
}

export interface DailyCheckInResponse extends DailyCheckIn {
  _id: Types.ObjectId;
}

@Schema({
  timestamps: true,
})
export class DailyCheckIn {
  @Prop({
    type: String,
    unique: true,
    index: true,
    required: [true, "Please specify field"],
  })
  walletAddress: string;

  @Prop({
    type: Number,
    default: 0,
  })
  streakCounter: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  lastCheckIn: Date;
}

export const DailyCheckInSchema = SchemaFactory.createForClass(DailyCheckIn);
DailyCheckInSchema.set("collection", MONGO_CONFIG.collections.dailyCheckIn);
