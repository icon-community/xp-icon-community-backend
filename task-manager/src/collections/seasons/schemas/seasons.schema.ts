import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";

import MONGO_CONFIG from "../../../config/mongo.config";

export type SeasonDocument = Season & Document;

export interface SeasonResponse extends SeasonDocument {
  _id: Types.ObjectId;
}

export class Season {
  @Prop({ required: [true, "Please specify field"], unique: true, index: true })
  number: number;

  @Prop({ required: [true, "Please specify field"] })
  blockStart: number;

  @Prop({
    required: [true, "Please specify field"],
    validate: {
      validator: (v: number) => v > (this as { blockStart: number }).blockStart,
      message: "blockEnd must be greater than blockStart",
    },
  })
  blockEnd: number;

  @Prop({ required: [true, "Please specify field"], default: true })
  active: boolean;

  @Prop({ required: [true, "Please specify field"] })
  tasks: MongooseSchema.Types.ObjectId[];
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
SeasonSchema.set("collection", MONGO_CONFIG.collections.seasons);
