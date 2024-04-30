//

// Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
 * User schema
 */
const userSchema = new Schema({
  walletAddress: {
    type: String,
    unique: true,
    index: true,
    required: [true, "Please specify field"],
  },
  registrationBlock: {
    type: Number,
    required: [true, "Please specify field"],
  },
  dailyCheckInStreak: {
    type: Number,
    default: 0,
  },
  referrals: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// const User = mongoose.model("User", userSchema);
module.exports = userSchema;
