import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { HydratedDocument } from "mongoose";

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
}

export type ReferralDocument = HydratedDocument<Referral>;
export const ReferralSchema = SchemaFactory.createForClass(Referral);
