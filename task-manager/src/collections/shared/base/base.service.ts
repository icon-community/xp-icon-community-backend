import { Model, Document } from "mongoose";

export class BaseService<
  T extends Document,
  CreateDto,
  UpdateDto,
  ResponseType = T,
> {
  constructor(private readonly model: Model<T>) {}

  async create(data: CreateDto): Promise<ResponseType> {
    const created = new this.model(data);
    return (await created.save()).toObject() as ResponseType;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  findAllLean(): Promise<ResponseType[]> {
    return this.model.find().lean().exec() as Promise<ResponseType[]>;
  }

  async findAllByQuery(query: UpdateDto): Promise<T[]> {
    return this.model.find(query).exec();
  }

  findAllByQueryLean(query: UpdateDto): Promise<ResponseType[]> {
    return this.model.find(query).lean().exec() as Promise<ResponseType[]>;
  }

  async findOne(id: string): Promise<T | null> {
    return this.model.findOne({ _id: id }).exec();
  }

  findOneLean(id: string): Promise<ResponseType | null> {
    return this.model
      .findOne({ _id: id })
      .lean()
      .exec() as Promise<ResponseType | null>;
  }

  async findByQuery(query: UpdateDto): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  findByQueryLean(query: UpdateDto): Promise<ResponseType | null> {
    return this.model
      .findOne(query)
      .lean()
      .exec() as Promise<ResponseType | null>;
  }

  async update(
    query: UpdateDto,
    data: UpdateDto,
  ): Promise<ResponseType | null> {
    return this.model
      .findOneAndUpdate(query, data, { new: true, upsert: true })
      .lean()
      .exec() as Promise<ResponseType | null>;
  }

  // updateLean(query: UpdateDto, data: UpdateDto): Promise<ResponseType | null> {
  //   return this.model
  //     .findOneAndUpdate(query, data, { new: true, upsert: true })
  //     .lean()
  //     .exec() as Promise<ResponseType | null>;
  // }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteLean(id: string): Promise<ResponseType | null> {
    return this.model
      .findByIdAndDelete(id)
      .lean()
      .exec() as Promise<ResponseType | null>;
  }
}
