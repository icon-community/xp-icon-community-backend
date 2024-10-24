import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateTaskDto } from "../../db-models";
import { ITask, TaskDocument } from "../../schemas/Task.schema";
import { Collections } from "../../../shared/models/enum/Collections";

@Injectable()
export class TaskDbService {
  constructor(@InjectModel(Collections.TASKS) private taskModel: Model<ITask>) {}

  async createTask(task: CreateTaskDto): Promise<TaskDocument> {
    const createdUserTask: TaskDocument = new this.taskModel(task);
    return createdUserTask.save();
  }

  async getAllUserTasks(): Promise<TaskDocument[]> {
    return this.taskModel.find().exec();
  }

  async getTaskBySeedId(seedId: Types.ObjectId): Promise<TaskDocument | null> {
    return this.taskModel
      .findOne({
        seedId: seedId,
      })
      .exec();
  }

  async getTaskById(taskId: Types.ObjectId): Promise<TaskDocument | null> {
    return this.taskModel
      .findOne({
        _id: taskId,
      })
      .exec();
  }

  async getTasksByIds(taskIds: Types.ObjectId[]): Promise<TaskDocument[]> {
    return this.taskModel
      .find({
        _id: { $in: [...taskIds] },
      })
      .exec();
  }
}
