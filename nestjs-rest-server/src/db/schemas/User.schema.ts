import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { REFERRAL_CODE_LENGTH } from "../../constants";

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
    type: () => Date,
    required: true,
  })
  registrationDate: Date;
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
  })
  walletAddress: string;

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

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
