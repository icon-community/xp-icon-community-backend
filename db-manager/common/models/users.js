//

// Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

const season = new Schema({
  seasonId: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: [true, "Please specify field"],
  },
  registrationBlock: {
    type: Number,
    required: [true, "Please specify field"],
  },
  referrals: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
});

/*
 * linked wallet schema
 */
const linkedWallet = new Schema({
  address: {
    type: String,
    unique: true,
    required: [true, "Please specify field"],
  },
  type: {
    type: String,
    required: true,
    enum: ["evm", "icon"],
  },
});

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
  linkedWallets: {
    type: [linkedWallet],
    default: [],
  },
  // registrationBlock: {
  //   type: Number,
  //   required: [true, "Please specify field"],
  // },
  dailyCheckInStreak: {
    type: Number,
    default: 0,
  },
  // referrals: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  seasons: {
    type: [season],
    default: [],
  },
  updatedAtBlock: {
    type: Number,
    required: [true, "Please specify field"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// const User = mongoose.model("User", userSchema);
module.exports = userSchema;
