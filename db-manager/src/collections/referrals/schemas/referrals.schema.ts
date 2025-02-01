import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import MONGO_CONFIG from "../../../config/mongo.config";

export type ReferralDocument = Referral & Document;

@Schema({
  timestamps: true, // This will automatically handle createdAt
})
export class Referral {
  @Prop({
    type: String,
    index: true,
    required: [true, "Please specify field"],
  })
  referrerUserAddress: string;

  @Prop({
    type: String,
    index: true,
    required: [true, "Please specify field"],
  })
  referredUserAddress: string;

  @Prop({
    type: String,
    index: true,
    required: [true, "Please specify field"],
  })
  referralCode: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: [true, "Please specify field"],
    ref: MONGO_CONFIG.collections.users,
  })
  referrerUserId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: [true, "Please specify field"],
    ref: MONGO_CONFIG.collections.users,
  })
  referredUserId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
    required: [true, "Please specify field"],
  })
  referrerIsProcessed: boolean;

  @Prop({
    type: Boolean,
    default: false,
    required: [true, "Please specify field"],
  })
  referredIsProcessed: boolean;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
