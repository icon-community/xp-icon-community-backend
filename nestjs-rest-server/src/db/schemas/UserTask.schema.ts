import { HydratedDocument, Types, Schema } from "mongoose";
import { Status } from "../../shared/models/enum/Status";

export interface IXpEarned {
  xp: number;
  block: number;
  period: number;
}

export const XpEarnedSchema = new Schema<IXpEarned>({
  xp: {
    type: Number,
    required: true,
  },
  block: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
});

export interface IUserTask {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  seasonId: Types.ObjectId;
  status: Status;
  walletAddress: string;
  xpEarned: IXpEarned[];
  updatedAtBlock: number;
  createdAt: Date;
}

export type UserTaskQuery = {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  seasonId: Types.ObjectId;
};

export type UserTaskDocument = HydratedDocument<IUserTask>;
export const UserTaskSchema = new Schema<IUserTask>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  seasonId: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
  status: {
    type: String,
    enum: Status,
    default: Status.PENDING,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  xpEarned: {
    type: [XpEarnedSchema],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAtBlock: {
    type: Number,
    required: true,
  },
});
