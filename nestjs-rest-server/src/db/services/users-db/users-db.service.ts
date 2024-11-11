import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IUser, UserDocument } from "../../schemas/User.schema";
import { Model, Types } from "mongoose";
import { CreateUserDto, UserSeasonDto } from "../../db-models";
import { MongoDbErrorCode } from "../../../shared/models/enum/MongoDbErrorCode";
import { LinkSocialDataDto } from "../../../user/dto/link-social-data.dto";
import { LinkWalletDto } from "../../../user/dto/link-wallet.dto";
import { MAX_LINKED_EVM_WALLETS } from "../../../constants";
import { Collections } from "../../../shared/models/enum/Collections";
import { isStellarAddress, isEvmAddress } from "@/shared/utils/validate-utils";

@Injectable()
export class UsersDbService {
  private readonly logger = new Logger(UsersDbService.name);

  constructor(@InjectModel(Collections.USERS) private userModel: Model<IUser>) {}

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    try {
      return await new this.userModel(user).save();
    } catch (e) {
      if (e.code != MongoDbErrorCode.DUPLICATE) {
        this.logger.error(`Failed to save new user equity.. Error: ${JSON.stringify(e, null, 2)}`);
      }

      throw e;
    }
  }

  async linkUserSocial(socialData: LinkSocialDataDto, address: string): Promise<UserDocument | null> {
    try {
      return this.userModel
        .findOneAndUpdate(
          {
            walletAddress: address,
            linkedSocials: {
              $not: { $elemMatch: { provider: socialData.provider, providerAccountId: socialData.providerAccountId } },
            },
          },
          {
            $push: { linkedSocials: socialData }, // Action to push new item
          },
          { new: true }, // Return updated document
        )
        .exec();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async linkUserWallet(linkWalletDto: LinkWalletDto, address: string): Promise<UserDocument | null> {
    try {
      // validate user wallet
      switch (linkWalletDto.type) {
        case "evm":
          if (!isEvmAddress(linkWalletDto.address)) {
            throw new Error("Invalid EVM wallet address");
          }
          break;
        case "stellar":
          if (!isStellarAddress(linkWalletDto.address)) {
            throw new Error("Invalid Stellar wallet address");
          }
          break;
        default:
          throw new Error("Invalid wallet type");
      }
      return this.userModel
        .findOneAndUpdate(
          {
            walletAddress: address,
            linkedWallets: {
              $not: { $elemMatch: { address: linkWalletDto.address, type: linkWalletDto.type } },
            },
            $expr: { $lt: [{ $size: "$linkedWallets" }, MAX_LINKED_EVM_WALLETS] },
          },
          {
            $push: { linkedWallets: linkWalletDto },
          },
          { new: true }, // Return updated document
        )
        .exec();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async getUserByAddress(address: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        walletAddress: address,
      })
      .exec();
  }

  async getUsersBySeason(seasonId: Types.ObjectId): Promise<UserDocument[] | null> {
    return this.userModel
      .find({
        "seasons.seasonId": seasonId,
      })
      .exec();
  }

  async getUsersByReferralCode(referralCode: string): Promise<IUser | null> {
    try {
      return await this.userModel
        .findOne({
          referralCode: referralCode,
        })
        .lean()
        .exec();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getUserReferralCode(address: string): Promise<string | undefined> {
    const user = await this.userModel
      .findOne({
        walletAddress: address,
      })
      .exec();

    return user ? user.referralCode : undefined;
  }

  async getUserCountBySeason(seasonId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        "seasons.seasonId": seasonId,
      })
      .exec();
  }

  async addSeasonToUser(address: string, season: UserSeasonDto): Promise<UserDocument | null> {
    // Check if user already has this season
    const existingUser = await this.userModel.findOne({
      walletAddress: address,
      "seasons.seasonId": season.seasonId,
    });

    // If user already has this season, return the user
    if (existingUser) {
      return existingUser;
    }

    return this.userModel
      .findOneAndUpdate(
        {
          walletAddress: address,
        },
        {
          $push: { seasons: season },
        },
        {
          upsert: false,
        },
      )
      .exec();
  }
}
