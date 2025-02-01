import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Seasons } from "./seasons.interface";
import { CreateSeasonDto, UpdateSeasonDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../../shared/base/base.service";

@Injectable()
export class SeasonsService extends BaseService<
  Seasons,
  CreateSeasonDto,
  UpdateSeasonDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.seasons)
    private readonly seasonsModel: Model<Seasons>,
  ) {
    super(seasonsModel);
  }

  async create(createSeasonDto: CreateSeasonDto): Promise<Seasons> {
    return super.create(createSeasonDto);
  }

  async update(
    query: UpdateSeasonDto,
    updateSeasonDto: UpdateSeasonDto,
  ): Promise<Seasons> {
    return super.update(query, updateSeasonDto);
  }

  async findActiveSeasons(): Promise<Seasons[]> {
    return this.seasonsModel.find({ active: true });
  }
}
