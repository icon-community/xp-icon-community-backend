// Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("../utils/config");

/*
 * Referrals schema
 */
const referralSchema = new Schema({
  referrerUserAddress: {
    type: String,
    index: true,
    required: [true, "Please specify field"],
  },
  referredUserAddress: {
    type: String,
    index: true,
    required: [true, "Please specify field"],
  },
  referralCode: {
    type: String,
    index: true,
    required: [true, "Please specify field"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  referrerUserId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please specify field"],
    ref: config.collections.users,
  },
  referredUserId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please specify field"],
    ref: config.collections.users,
  },
  isProcessed: {
    type: Boolean,
    default: false,
    required: [true, "Please specify field"],
  },
});

module.exports = referralSchema;
