import { HydratedDocument, Schema, Types } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { SeasonLabel } from "src/shared/models/enum/SeasonLabel";

export interface IReferral {
  referrerUserAddress: string; // The user who owns the referral code
  referredUserAddress: string; // The user who was referred
  referralCode: string;
  seasonLabel: SeasonLabel;
  createdAt: Date;
  referrerUserId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  referrerIsProcessed: boolean;
  referredIsProcessed: boolean;
}

export type ReferralDocument = HydratedDocument<IReferral>;
export const ReferralSchema = new Schema<IReferral>(
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
        validator: function (v): boolean {
          return v !== this.referrerUserAddress;
        },
        message: "referredUserAddress must be different from referrerUserAddress",
      },
    },
    referralCode: {
      type: String,
      index: true,
      required: [true, "Please specify field"],
    },
    seasonLabel: {
      type: String,
      enum: SeasonLabel,
      required: [true, "Please specify field"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    referrerUserId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please specify field"],
      ref: Collections.USERS,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: [true, "Please specify field"],
      ref: Collections.USERS,
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
    collection: Collections.REFERRALS,
    timestamps: {
      createdAt: true,
    },
    autoCreate: true,
    autoIndex: true,
  },
);

ReferralSchema.index({ referredUserId: 1, seasonLabel: 1 }, { unique: true });
