import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  DailyCheckInDocument,
  DailyCheckInResponse,
} from "./schemas/daily-check-in.schema";
import { CreateDailyCheckInDto, UpdateDailyCheckInDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class DailyCheckInService extends BaseService<
  DailyCheckInDocument,
  CreateDailyCheckInDto,
  UpdateDailyCheckInDto,
  DailyCheckInResponse
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.dailyCheckIn)
    private readonly dailyCheckInModel: Model<DailyCheckInDocument>,
  ) {
    super(dailyCheckInModel);
  }

  async create(
    createDailyCheckInDto: CreateDailyCheckInDto,
  ): Promise<DailyCheckInResponse> {
    return super.create(createDailyCheckInDto);
  }

  async update(
    query: UpdateDailyCheckInDto,
    updateDailyCheckInDto: UpdateDailyCheckInDto,
  ): Promise<DailyCheckInResponse> {
    return super.update(query, updateDailyCheckInDto);
  }

  async findByWalletAddress(
    walletAddress: string,
  ): Promise<DailyCheckInResponse> {
    return super.findByQueryLean({ walletAddress });
  }
}
