import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schemas/User.schema";
import { Model, Types } from "mongoose";
import { CreateUserDto, UserSeasonDto } from "../../db-models";

@Injectable()
export class UsersDbService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    const createdUser: UserDocument = new this.userModel(user);
    return createdUser.save();
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
