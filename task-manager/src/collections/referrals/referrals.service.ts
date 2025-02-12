import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReferralDocument } from "./schemas/referrals.schema";
import { CreateReferralDto, UpdateReferralDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class ReferralsService extends BaseService<
  ReferralDocument,
  CreateReferralDto,
  UpdateReferralDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.referrals)
    private readonly referralsModel: Model<ReferralDocument>,
  ) {
    super(referralsModel);
  }

  async create(
    createReferralDto: CreateReferralDto,
  ): Promise<ReferralDocument> {
    return super.create(createReferralDto);
  }

  async update(
    query: UpdateReferralDto,
    updateReferralDto: UpdateReferralDto,
  ): Promise<ReferralDocument> {
    return super.update(query, updateReferralDto);
  }

  async findByReferrerAddress(
    referrerUserAddress: string,
  ): Promise<ReferralDocument[]> {
    return this.referralsModel.find({ referrerUserAddress }).exec();
  }

  async findByReferredAddress(
    referredUserAddress: string,
  ): Promise<ReferralDocument> {
    return super.findByQuery({ referredUserAddress });
  }

  async findByReferralCode(referralCode: string): Promise<ReferralDocument> {
    return super.findByQuery({ referralCode });
  }

  async findByReferrerId(
    referrerUserId: Types.ObjectId,
  ): Promise<ReferralDocument[]> {
    return this.referralsModel.find({ referrerUserId }).exec();
  }

  async findByReferredId(
    referredUserId: Types.ObjectId,
  ): Promise<ReferralDocument> {
    return super.findByQuery({ referredUserId });
  }
}
