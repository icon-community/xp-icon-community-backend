import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument, UserResponse } from "./schemas/users.schema";
import { CreateUserDto, UpdateUserDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class UsersService extends BaseService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto,
  UserResponse
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.users)
    private readonly usersModel: Model<UserDocument>,
  ) {
    super(usersModel);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    return super.create(createUserDto);
  }

  async update(
    query: UpdateUserDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return super.update(query, updateUserDto);
  }

  async findByWalletAddress(walletAddress: string): Promise<UserResponse> {
    return super.findByQueryLean({ walletAddress });
  }

  async findUsersBySeason(seasonId: Types.ObjectId): Promise<UserResponse[]> {
    return super.findAllByQueryLean({
      "seasons.seasonId": seasonId,
    } as any);
  }
}
