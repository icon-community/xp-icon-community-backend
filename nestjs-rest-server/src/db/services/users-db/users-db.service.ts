import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schemas/User.schema";
import { Model, Types } from "mongoose";
import { CreateUserDto, UserSeasonDto } from "../../db-models";
import { MongoDbErrorCode } from "../../../shared/models/enum/MongoDbErrorCode";

@Injectable()
export class UsersDbService {
  private readonly logger = new Logger(UsersDbService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto): Promise<boolean> {
    try {
      const createdUser: UserDocument = await new this.userModel(user).save();

      return createdUser != null;
    } catch (e) {
      if (e.code != MongoDbErrorCode.DUPLICATE) {
        this.logger.error(`Failed to save new user equity.. Error: ${JSON.stringify(e, null, 2)}`);
      }

      throw e;
    }
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async getUserByAddress(address: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        walletAddress: address.toLowerCase(),
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

  async getUsersByReferralCode(referralCode: string): Promise<User | null> {
    return this.userModel
      .findOne({
        referralCode: referralCode,
      })
      .lean()
      .exec();
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
    return this.userModel
      .findOneAndUpdate(
        {
          walletAddress: address.toLowerCase(),
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
