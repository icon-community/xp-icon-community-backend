const mongoose = require("mongoose");
const { Schema } = mongoose;

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
);

module.exports = dailyCheckInSchema;
