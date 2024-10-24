import { HydratedDocument, Schema } from "mongoose";
import { Chains } from "../../shared/models/enum/Chains";
import { Collections } from "../../shared/models/enum/Collections";
import { ChainType } from "../../shared/models/enum/ChainType";

export interface ITask {
  seedId: string;
  type: string;
  description: string;
  criteria: any;
  title: string;
  rewardFormula: [string];
  chain: Chains;
  createdAt: Date;
}

export type TaskDocument = HydratedDocument<ITask>;
export const TaskSchema = new Schema<ITask>(
  {
    seedId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    criteria: Schema.Types.Mixed,
    title: { type: String, required: true },
    rewardFormula: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    chain: { type: String, required: true, enum: ChainType },
  },
  {
    collection: Collections.TASKS,
  },
);
