import { HydratedDocument, Schema, Types } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";

export interface ISeason {
  number: number;
  blockStart: number;
  blockEnd: number;
  active: boolean;
  contract: string;
  tasks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type SeasonsDocument = HydratedDocument<ISeason>;
export const SeasonsSchema = new Schema<ISeason>({
  number: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  blockStart: {
    type: Number,
    required: true,
  },
  blockEnd: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.blockStart;
      },
      message: "blockEnd must be greater than blockStart",
    },
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  contract: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: Collections.TASKS,
      required: true,
    },
  ],
},{
  collection: Collections.SEASONS,
})
