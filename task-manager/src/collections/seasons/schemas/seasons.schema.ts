import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import MONGO_CONFIG from "../../../config/mongo.config";

export type SeasonDocument = Season & Document;

export interface SeasonResponse extends SeasonDocument {
  _id: Types.ObjectId;
}

@Schema()
export class Season {
  @Prop({ required: true, unique: true })
  label: string;

  @Prop({ required: true })
  blockStart: number;

  @Prop({
    required: true,
    validate: [
      {
        validator: function (blockEnd: number) {
          return !this.blockStart || blockEnd > this.blockStart;
        },
        message: "blockEnd must be greater than blockStart",
      },
    ],
  })
  blockEnd: number;

  @Prop({ required: [true, "Please specify field"], default: true })
  active: boolean;

  @Prop({ type: [Types.ObjectId], required: true })
  tasks: Types.ObjectId[];
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
SeasonSchema.set("collection", MONGO_CONFIG.collections.seasons);
