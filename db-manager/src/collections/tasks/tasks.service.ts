import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks } from './tasks.interface';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import MONGO_CONFIG from '../../config/mongo.config';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class TasksService extends BaseService<
  Tasks,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(
    @InjectModel(MONGO_CONFIG.collections.tasks)
    private readonly tasksModel: Model<Tasks>,
  ) {
    super(tasksModel);
  }

  async create(createTaskDto: CreateTaskDto): Promise<Tasks> {
    return super.create(createTaskDto);
  }

  async update(
    query: UpdateTaskDto,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Tasks> {
    return super.update(query, updateTaskDto);
  }

  async findBySeedId(seedId: string): Promise<Tasks> {
    return super.findByQuery({ seedId });
  }
}
