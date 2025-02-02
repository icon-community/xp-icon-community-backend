import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserTaskDocument } from "./schemas/user-tasks.schema";
import { CreateUserTaskDto, UpdateUserTaskDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class UserTasksService extends BaseService<
  UserTaskDocument,
  CreateUserTaskDto,
  UpdateUserTaskDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.userTasks)
    private readonly userTasksModel: Model<UserTaskDocument>,
  ) {
    super(userTasksModel);
  }

  async create(
    createUserTaskDto: CreateUserTaskDto,
  ): Promise<UserTaskDocument> {
    return super.create(createUserTaskDto);
  }

  async update(
    query: UpdateUserTaskDto,
    updateUserTaskDto: UpdateUserTaskDto,
  ): Promise<UserTaskDocument> {
    return super.update(query, updateUserTaskDto);
  }

  async findByUserId(userId: Types.ObjectId): Promise<UserTaskDocument> {
    return super.findByQuery({ userId });
  }

  async findByTaskId(taskId: Types.ObjectId): Promise<UserTaskDocument> {
    return super.findByQuery({ taskId });
  }

  async findBySeasonId(seasonId: Types.ObjectId): Promise<UserTaskDocument> {
    return super.findByQuery({ seasonId });
  }

  async findByAllIds(
    userId: Types.ObjectId,
    taskId: Types.ObjectId,
    seasonId: Types.ObjectId,
  ): Promise<UserTaskDocument> {
    return super.findByQuery({ userId, taskId, seasonId });
  }
}
