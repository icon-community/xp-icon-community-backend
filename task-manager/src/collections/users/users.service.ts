import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument, UserResponse } from "./schemas/users.schema";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { LinkWalletDto } from "./dto/link-wallet.dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";
import { MAX_LINKED_WALLETS } from "../../constants";
import {
  isEvmAddress,
  isStellarAddress,
  isSuiAddress,
} from "../../utils/validate-util";
import { Chains } from "../../shared/enum/general-enum";
import { TaskInputTypeRegistration } from "../../shared/types/GeneralTypes";
import { TaskProducerService } from "../../tasks/task-producer.service";

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
    private taskProducerService: TaskProducerService,
  ) {
    super(usersModel);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    return super.create(createUserDto);
  }

  async findByWalletAddress(walletAddress: string): Promise<UserResponse> {
    return super.findByQueryLean({ walletAddress });
  }

  async findUsersBySeason(seasonId: Types.ObjectId): Promise<UserResponse[]> {
    return super.findAllByQueryLean({
      "seasons.seasonId": seasonId,
    } as any);
  }

  async linkWallet(
    address: string,
    linkWalletDto: LinkWalletDto,
  ): Promise<UserResponse | null> {
    // Validate wallet address based on chain type
    switch (linkWalletDto.type) {
      case Chains.evm:
        if (!isEvmAddress(linkWalletDto.address)) {
          throw new Error("Invalid EVM wallet address");
        }
        break;
      case Chains.stellar:
        if (!isStellarAddress(linkWalletDto.address)) {
          throw new Error("Invalid Stellar wallet address");
        }
        break;
      case Chains.sui:
        if (!isSuiAddress(linkWalletDto.address)) {
          throw new Error("Invalid Sui wallet address");
        }
        break;
      default:
        throw new Error("Invalid wallet type");
    }

    return super.findOneAndUpdateLean(
      {
        walletAddress: address,
        linkedWallets: {
          $not: {
            $elemMatch: {
              address: linkWalletDto.address,
              type: linkWalletDto.type,
            },
          },
        },
        $expr: { $lt: [{ $size: "$linkedWallets" }, MAX_LINKED_WALLETS] },
      },
      {
        $push: { linkedWallets: linkWalletDto },
      },
      { new: true, upsert: false },
    );
  }

  async registerSeason(
    address: string,
    seasonId: Types.ObjectId,
    registrationBlock: number,
  ): Promise<UserResponse | null> {
    return super.findOneAndUpdateLean(
      {
        walletAddress: address,
        "seasons.seasonId": { $ne: seasonId }, // Only if user isn't already registered
      },
      {
        $push: {
          seasons: {
            seasonId,
            registrationBlock: registrationBlock,
          },
        },
      },
      { new: true, upsert: false },
    );
  }

  async awardRegistrationXp(params: TaskInputTypeRegistration) {
    await this.taskProducerService.sendTaskToTriggeredQueue({
      taskName: "awardRegistrationXp",
      params: params,
    });
  }
}
