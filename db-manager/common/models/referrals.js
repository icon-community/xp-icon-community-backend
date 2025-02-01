// Imports
const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("../utils/config");
const COLLECTION_NAME = config.collections.referrals;

/*
 * Referrals schema
 */
const referralSchema = new Schema(
  {
    referrerUserAddress: {
      type: String,
      index: true,
      required: [true, "Please specify field"],
    },
    referredUserAddress: {
      type: String,
      index: true,
      unique: true,
      required: [true, "Please specify field"],
      validate: {
        validator: function (v) {
          return v !== this.referrerUserAddress;
        },
        message:
          "referredUserAddress must be different from referrerUserAddress",
      },
    },
    referralCode: {
      type: String,
      index: true,
      required: [true, "Please specify field"],
    },
    seasonLabel: {
      type: String,
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
    referrerIsProcessed: {
      type: Boolean,
      default: false,
      required: [true, "Please specify field"],
    },
    referredIsProcessed: {
      type: Boolean,
      default: false,
      required: [true, "Please specify field"],
    },
  },
  {
    collection: config.collections.referrals,
    timestamps: {
      createdAt: true,
    },
    autoCreate: true,
    autoIndex: true,
  },
  { collection: COLLECTION_NAME },
);

referralSchema.index({ referredUserId: 1, seasonLabel: 1 }, { unique: true });

module.exports = referralSchema;
