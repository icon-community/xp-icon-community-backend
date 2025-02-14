import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SeasonDocument, SeasonResponse } from "./schemas/seasons.schema";
import { CreateSeasonDto, UpdateSeasonDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class SeasonsService extends BaseService<
  SeasonDocument,
  CreateSeasonDto,
  UpdateSeasonDto,
  SeasonResponse
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.seasons)
    private readonly seasonsModel: Model<SeasonDocument>,
  ) {
    super(seasonsModel);
  }

  async create(createSeasonDto: CreateSeasonDto): Promise<SeasonResponse> {
    return super.create(createSeasonDto) as Promise<SeasonResponse>;
  }

  async update(
    query: UpdateSeasonDto,
    updateSeasonDto: UpdateSeasonDto,
  ): Promise<SeasonResponse> {
    return super.update(query, updateSeasonDto) as Promise<SeasonResponse>;
  }

  async findAll(): Promise<SeasonResponse[]> {
    return super.findAllLean();
  }

  async findActiveSeasons(): Promise<SeasonResponse[]> {
    return super.findByQuery({ active: true }) as unknown as Promise<
      SeasonResponse[]
    >;
  }
}
