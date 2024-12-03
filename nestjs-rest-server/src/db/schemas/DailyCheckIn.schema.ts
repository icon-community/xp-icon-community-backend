import { HydratedDocument, Schema } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";

export interface IDailyCheckIn {
  walletAddress: string;
  streakCounter: number;
  lastCheckIn: Date;
}

export type DailyCheckInDocument = HydratedDocument<IDailyCheckIn>;
export const DailyCheckInSchema = new Schema<IDailyCheckIn>(
  {
    walletAddress: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Please specify field"],
    },
    streakCounter: {
      type: Number,
      default: 0,
    },
    lastCheckIn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: Collections.DAILY_CHECK_IN,
  },
);
