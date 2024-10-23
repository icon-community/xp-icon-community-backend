import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { REFERRAL_CODE_LENGTH } from "../../constants";
import { ChainType } from "../../shared/models/enum/ChainType";

@Schema({
  _id: false,
})
export class LinkedWallet {
  @Prop({
    type: String,
    isRequired: true,
    unique: true,
    sparse: true,
    lowercase: true,
  })
  address: string;

  @Prop({
    type: String,
    isRequired: true,
    enum: ChainType,
  })
  type: ChainType;
}

export type LinkedWalletDocument = HydratedDocument<LinkedWallet>;
export const LinkedWalletSchema = SchemaFactory.createForClass(LinkedWallet);

@Schema({
  _id: false,
})
export class SocialData {
  @Prop({
    type: String,
    isRequired: true,
  })
  provider: string;

  @Prop({
    type: String,
    isRequired: true,
    unique: true,
    sparse: true,
  })
  providerAccountId: string;

  @Prop({
    type: String,
    isRequired: false,
  })
  name: string | null | undefined;

  @Prop({
    type: String,
    isRequired: false,
  })
  email: string | null | undefined;

  @Prop({
    type: String,
    isRequired: false,
  })
  imageUrl: string | null | undefined;
}

export type SocialDataDocument = HydratedDocument<SocialData>;
export const SocialDataSchema = SchemaFactory.createForClass(SocialData);

@Schema({
  _id: false,
})
export class UserSeason {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Collections.SEASONS,
    isRequired: true,
  })
  seasonId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  registrationBlock: number;
}

export type UserSeasonDocument = HydratedDocument<UserSeason>;
export const UserSeasonSchema = SchemaFactory.createForClass(UserSeason);

@Schema({
  collection: Collections.USERS,
  autoCreate: true,
  autoIndex: true,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class User {
  @Prop({
    type: String,
    isRequired: true,
    unique: true,
    index: true,
    lowercase: true,
  })
  walletAddress: string;

  @Prop({
    type: Number,
    default: 0,
  })
  dailyCheckInStreak: number;

  @Prop({
    type: [UserSeasonSchema],
    default: [],
  })
  seasons: UserSeason[];

  @Prop({
    isRequired: true,
    immutable: true,
    maxlength: REFERRAL_CODE_LENGTH,
  })
  referralCode: string;

  @Prop({
    type: [SocialDataSchema],
    default: [],
  })
  linkedSocials: SocialData[];

  @Prop({
    type: [LinkedWalletSchema],
    default: [],
  })
  linkedWallets: LinkedWallet[];

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
