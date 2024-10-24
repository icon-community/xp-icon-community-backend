import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateSeasonDto } from "../../db-models";
import { ISeason, SeasonsDocument } from "../../schemas/Seasons.schema";
import { Collections } from "../../../shared/models/enum/Collections";

@Injectable()
export class SeasonDbService {
  constructor(@InjectModel(Collections.SEASONS) private seasonModel: Model<ISeason>) {}

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
