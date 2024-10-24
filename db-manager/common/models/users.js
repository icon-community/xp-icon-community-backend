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
});

/*
 * linked wallet schema
 */
const linkedWallet = new Schema({
  address: {
    type: String,
    // unique: true,
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
    validate: {
      validator: function (wallets) {
        const addresses = wallets.map((wallet) => wallet.address);
        return addresses.length === new Set(addresses).size;
      },
      message: "Address in linkedWallets must be unique",
    },
  },
  dailyCheckInStreak: {
    type: Number,
    default: 0,
  },
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
