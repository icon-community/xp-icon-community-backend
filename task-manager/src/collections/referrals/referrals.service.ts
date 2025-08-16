import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReferralDocument, ReferralResponse } from "./schemas/referrals.schema";
import { CreateReferralDto, UpdateReferralDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class ReferralsService extends BaseService<
  ReferralDocument,
  CreateReferralDto,
  UpdateReferralDto,
  ReferralResponse
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.referrals)
    private readonly referralsModel: Model<ReferralDocument>,
  ) {
    super(referralsModel);
  }

  async create(
    createReferralDto: CreateReferralDto,
  ): Promise<ReferralResponse> {
    return super.create(createReferralDto);
  }

  async update(
    query: UpdateReferralDto,
    updateReferralDto: UpdateReferralDto,
  ): Promise<ReferralResponse> {
    return super.update(query, updateReferralDto);
  }

  async findByReferrerAddress(
    referrerUserAddress: string,
  ): Promise<ReferralResponse[]> {
    return super.findAllByQueryLean({ referrerUserAddress });
  }

  async findByReferredAddress(
    referredUserAddress: string,
  ): Promise<ReferralResponse> {
    return super.findByQueryLean({ referredUserAddress });
  }

  async findByReferralCode(referralCode: string): Promise<ReferralResponse> {
    return super.findByQueryLean({ referralCode });
  }

  async findByReferrerId(
    referrerUserId: Types.ObjectId,
  ): Promise<ReferralResponse[]> {
    return super.findAllByQueryLean({ referrerUserId });
  }

  async findByReferredId(
    referredUserId: Types.ObjectId,
  ): Promise<ReferralResponse> {
    return super.findByQueryLean({ referredUserId });
  }
}
