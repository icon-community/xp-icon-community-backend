import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks } from './tasks.interface';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TASKS_MODEL } from '../../constants';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class TasksService extends BaseService<
  Tasks,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(
    @InjectModel(TASKS_MODEL)
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
}
