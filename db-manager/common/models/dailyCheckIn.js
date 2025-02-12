const mongoose = require("mongoose");
const config = require("../utils/config");
const { Schema } = mongoose;
const COLLECTION_NAME = config.collections.dailyCheckIn;

const dailyCheckInSchema = new Schema(
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
  { collection: COLLECTION_NAME },
);

module.exports = dailyCheckInSchema;
