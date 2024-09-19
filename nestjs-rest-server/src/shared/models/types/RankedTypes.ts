import { Types } from "mongoose";

export type TaskXp = { task: Types.ObjectId; xp: number };

export type RankData = {
  _id: Types.ObjectId;
  address: string;
  total: number;
  tasks: TaskXp[];
};
