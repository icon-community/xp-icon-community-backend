import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserTaskDto, UpdateUserTaskDto } from "../../db-models";
import { IUserTask, UserTaskDocument, UserTaskQuery } from "../../schemas/UserTask.schema";
import { Collections } from "../../../shared/models/enum/Collections";

@Injectable()
export class UsersTaskDbService {
  constructor(@InjectModel(Collections.USER_TASKS) private userTaskModel: Model<IUserTask>) {}

  async createUserTask(task: CreateUserTaskDto): Promise<UserTaskDocument> {
    const createdUserTask: UserTaskDocument = new this.userTaskModel(task);
    return createdUserTask.save();
  }

  async getAllUserTasks(): Promise<UserTaskDocument[]> {
    return this.userTaskModel.find().exec();
  }

  async getUserTaskByAllIds(
    userId: Types.ObjectId,
    taskId: Types.ObjectId,
    seasonId: Types.ObjectId,
  ): Promise<UserTaskDocument | null> {
    return this.userTaskModel
      .findOne({
        userId: userId,
        taskId: taskId,
        seasonId: seasonId,
      })
      .exec();
  }

  async updateOrCreateUserTask(
    query: UserTaskQuery,
    updateData: Partial<UpdateUserTaskDto>,
  ): Promise<UserTaskDocument | null> {
    return this.userTaskModel
      .findOneAndUpdate(query, updateData, {
        upsert: true,
      })
      .exec();
  }
}
