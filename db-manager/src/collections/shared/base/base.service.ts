import { Model, Document } from "mongoose";

export class BaseService<T extends Document, CreateDto, UpdateDto> {
  constructor(private readonly model: Model<T>) {}

  async create(data: CreateDto): Promise<T> {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findAllByQuery(query: UpdateDto): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async findOne(id: string): Promise<T> {
    return this.model.findOne({ _id: id }).exec();
  }

  async findByQuery(query: UpdateDto): Promise<T> {
    return this.model.findOne(query).exec();
  }

  async update(query: UpdateDto, data: UpdateDto): Promise<T> {
    return this.model
      .findOneAndUpdate(query, data, { new: true, upsert: true })
      .exec();
  }

  async delete(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
