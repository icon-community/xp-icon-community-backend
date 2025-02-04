import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import MONGO_CONFIG from "../../../config/mongo.config";
import { Chains } from "../../../shared/enum/general-enum";

@Schema()
class LinkedWallet {
  @Prop({
    type: String,
    required: [true, "Please specify field"],
  })
  address: string;

  @Prop({
    type: String,
    required: true,
    enum: Chains,
  })
  type: Chains;
}

@Schema()
class Season {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: MONGO_CONFIG.collections.seasons,
    required: [true, "Please specify field"],
  })
  seasonId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Number,
    required: [true, "Please specify field"],
  })
  registrationBlock: number;
}

export type UserDocument = User & Document;
export interface UserResponse extends User {
  _id: Types.ObjectId;
}

@Schema({
  timestamps: true, // This will automatically handle createdAt and updatedAt
})
export class User {
  @Prop({
    type: String,
    unique: true,
    index: true,
    required: [true, "Please specify field"],
  })
  walletAddress: string;

  @Prop({
    type: [LinkedWallet],
    default: [],
    validate: {
      validator: function (wallets: LinkedWallet[]) {
        const addresses = wallets.map((wallet) => wallet.address);
        return addresses.length === new Set(addresses).size;
      },
      message: "Address in linkedWallets must be unique",
    },
  })
  linkedWallets: LinkedWallet[];

  @Prop({
    type: Number,
    default: 0,
  })
  dailyCheckInStreak: number;

  @Prop({
    type: [Season],
    default: [],
  })
  seasons: Season[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set("collection", MONGO_CONFIG.collections.users);
