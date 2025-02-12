import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TaskDocument, TaskResponse } from "./schemas/tasks.schema";
import { CreateTaskDto, UpdateTaskDto } from "./dto";
import MONGO_CONFIG from "../../config/mongo.config";
import { BaseService } from "../shared/base/base.service";

@Injectable()
export class TasksService extends BaseService<
  TaskDocument,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.tasks)
    private readonly tasksModel: Model<TaskDocument>,
  ) {
    super(tasksModel);
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    return super.create(createTaskDto) as Promise<TaskResponse>;
  }

  async update(
    query: UpdateTaskDto,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    return super.update(query, updateTaskDto) as Promise<TaskResponse>;
  }

  async findAll(): Promise<TaskResponse[]> {
    return super.findAll() as Promise<TaskResponse[]>;
  }

  async findBySeedId(seedId: string): Promise<TaskResponse> {
    return super.findByQuery({ seedId }) as Promise<TaskResponse>;
  }
}
