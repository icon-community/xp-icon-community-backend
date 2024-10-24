import { HydratedDocument, SchemaTypes, Types, Schema } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";
import { REFERRAL_CODE_LENGTH } from "../../constants";
import { ChainType } from "../../shared/models/enum/ChainType";

interface ILinkedWallet {
  address: string;
  type: ChainType;
}

export const LinkedWalletSchema = new Schema<ILinkedWallet>({
    address: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      required: [true, "Please specify field"],
    },
    type: {
      type: String,
      required: [true, "Please specify field"],
      enum: ChainType,
    }
  },
  {
    _id: false,
  });

interface ISocialData {
  provider: string;
  providerAccountId: string;
  name: string | null | undefined;
  email: string | null | undefined;
  imageUrl: string | null | undefined;
}

export const SocialDataSchema = new Schema<ISocialData>({
    provider: {
      type: String,
      required: [true, "Please specify field"],
    },
    providerAccountId: {
      type: String,
      required: [true, "Please specify field"],
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [false, ""],
    },
    email: {
      type: String,
      required: [false, ""],
    },
    imageUrl: {
      type: String,
      required: [false, ""],
    },
  },
  {
    _id: false,
  });


export interface IUserSeasonRegistration {
  seasonId: Types.ObjectId;
  registrationBlock: number;
}

export const UserSeasonRegistrationSchema = new Schema<IUserSeasonRegistration>({
    seasonId: {
      type: SchemaTypes.ObjectId,
      ref: Collections.SEASONS,
      required: [true, "Please specify field"],
    },
    registrationBlock: {
      type: Number,
      required: [true, "Please specify field"],
    }
  },
  {
    _id: false,
  });

export interface IUser {
  walletAddress: string;
  dailyCheckInStreak: number;
  seasons: IUserSeasonRegistration[];
  linkedWallets: ILinkedWallet[];
  linkedSocials: ISocialData[];
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;
export const UserSchema = new Schema<IUser>({
    walletAddress: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      required: [true, "Please specify field"],
    },
    dailyCheckInStreak: {
      type: Number,
      default: 0,
    },
    seasons: {
      type: [UserSeasonRegistrationSchema],
      default: [],
    },
    referralCode: {
      type: String,
      required: [true, "Please specify field"],
      immutable: true,
      maxlength: REFERRAL_CODE_LENGTH,
    },
    linkedSocials: {
      type: [SocialDataSchema],
      default: [],
    },
    linkedWallets: {
        type: [LinkedWalletSchema],
        default: [],
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
  },
  {
    collection: Collections.USERS
  });
