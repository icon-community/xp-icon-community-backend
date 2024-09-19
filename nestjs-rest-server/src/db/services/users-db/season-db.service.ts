import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateSeasonDto } from "../../db-models";
import { Season, SeasonsDocument } from "../../schemas/Seasons.schema";

@Injectable()
export class SeasonDbService {
  constructor(@InjectModel(Season.name) private seasonModel: Model<Season>) {}

  async createSeason(task: CreateSeasonDto): Promise<SeasonsDocument> {
    const createdSeason: SeasonsDocument = new this.seasonModel(task);
    return createdSeason.save();
  }

  async updateSeason(id: Types.ObjectId, updateData: Partial<CreateSeasonDto>): Promise<SeasonsDocument | null> {
    return this.seasonModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updateData,
        {
          upsert: true,
        },
      )
      .exec();
  }

  async getAllSeasons(): Promise<SeasonsDocument[]> {
    return this.seasonModel.find().exec();
  }

  async getActiveSeason(): Promise<SeasonsDocument | null> {
    return this.seasonModel
      .findOne({
        active: true,
      })
      .exec();
  }

  async getSeasonByNumberId(numberId: number): Promise<SeasonsDocument | null> {
    return this.seasonModel
      .findOne({
        number: numberId,
      })
      .exec();
  }
}
