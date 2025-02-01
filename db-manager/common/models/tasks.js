//

// Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("../utils/config");
const COLLECTION_NAME = config.collections.task;

/*
 *
 */
const taskSchema = new Schema(
  {
    seedId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    criteria: Schema.Types.Mixed,
    title: { type: String, required: true },
    rewardFormula: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    // TODO: the values of the enum should be defined in a separate file
    chain: { type: String, required: true, enum: ["icon", "evm"] },
  },
  { collection: COLLECTION_NAME },
);

module.exports = taskSchema;
