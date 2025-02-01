import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DailyCheckInDocument = DailyCheckIn & Document;

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
