import * as mongoose from "mongoose";
const { Schema } = mongoose;
import MONGO_CONFIG from "../../../config/mongo.config";

/*
 * Season Schema
 */
export const SeasonSchema = new Schema({
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
      ref: MONGO_CONFIG.collections.tasks,
      required: true,
    },
  ],
});
