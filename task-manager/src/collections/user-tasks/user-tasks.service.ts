import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  XpEarned,
  UserTaskDocument,
  UserTaskResponse,
} from "./schemas/user-tasks.schema";
import { CreateUserTaskDto, UpdateUserTaskDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class UserTasksService extends BaseService<
  UserTaskDocument,
  CreateUserTaskDto,
  UpdateUserTaskDto,
  UserTaskResponse
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.userTasks)
    private readonly userTasksModel: Model<UserTaskDocument>,
  ) {
    super(userTasksModel);
  }

  async create(
    createUserTaskDto: CreateUserTaskDto,
  ): Promise<UserTaskResponse> {
    return super.create(createUserTaskDto) as Promise<UserTaskResponse>;
  }

  async addXp(
    docId: Types.ObjectId,
    newXp: XpEarned,
  ): Promise<UserTaskResponse> {
    return super.update(
      { _id: docId } as any,
      { $push: { xpEarned: newXp } } as any,
    ) as Promise<UserTaskResponse>;
  }

  async update(
    query: UpdateUserTaskDto,
    updateUserTaskDto: UpdateUserTaskDto,
  ): Promise<UserTaskResponse> {
    return super.update(query, updateUserTaskDto) as Promise<UserTaskResponse>;
  }

  async findByUserId(userId: Types.ObjectId): Promise<UserTaskResponse> {
    return super.findByQueryLean({ userId });
  }

  async findByTaskId(taskId: Types.ObjectId): Promise<UserTaskResponse> {
    return super.findByQueryLean({ taskId });
  }

  async findBySeasonId(seasonId: Types.ObjectId): Promise<UserTaskResponse> {
    return super.findByQueryLean({ seasonId });
  }

  async findByAllIds(
    userId: Types.ObjectId,
    taskId: Types.ObjectId,
    seasonId: Types.ObjectId,
  ): Promise<UserTaskResponse> {
    return super.findByQueryLean({
      userId,
      taskId,
      seasonId,
    });
  }
}
