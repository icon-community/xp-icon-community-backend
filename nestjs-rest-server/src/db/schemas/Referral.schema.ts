import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { HydratedDocument, Types } from "mongoose";

@Schema({
  collection: Collections.REFERRALS,
  autoCreate: true,
  autoIndex: true,
  timestamps: {
    createdAt: true,
  },
})
export class Referral {
  @Prop({
    type: String,
    isRequired: true,
    index: true,
  })
  referrerUserAddress: string; // The user who owns the referral code

  @Prop({
    type: String,
    isRequired: true,
    unique: true,
    index: true,
  })
  referredUserAddress: string; // The user who was referred

  @Prop({
    type: String,
    index: true,
  })
  referralCode: string;
  createdAt: Date;

  @Prop({
    type: Types.ObjectId,
    isRequired: true,
    ref: Collections.USERS,
  })
  referrerUserId: Types.ObjectId; // Id of the user who owns the referral code

  @Prop({
    type: Types.ObjectId,
    isRequired: true,
    ref: Collections.USERS,
  })
  referredUserId: Types.ObjectId; // Id of the user who was referred

  @Prop({
    type: Boolean,
    isRequired: true,
    default: false,
  })
  isProcessed: boolean; // Whether the referral has been processed or not
}

export type ReferralDocument = HydratedDocument<Referral>;
export const ReferralSchema = SchemaFactory.createForClass(Referral);
