import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/users.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import MONGO_CONFIG from '../../config/mongo.config';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class UsersService extends BaseService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.users)
    private readonly usersModel: Model<UserDocument>,
  ) {
    super(usersModel);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return super.create(createUserDto);
  }

  async update(
    query: UpdateUserDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return super.update(query, updateUserDto);
  }

  async findByWalletAddress(walletAddress: string): Promise<UserDocument> {
    return super.findByQuery({ walletAddress });
  }

  async findUsersBySeason(seasonId: Types.ObjectId): Promise<UserDocument> {
    return super.findByQuery({ seasons: { $elemMatch: { seasonId } } } as any);
  }
}
