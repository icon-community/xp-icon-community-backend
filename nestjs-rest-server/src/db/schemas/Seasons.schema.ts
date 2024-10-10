import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Collections } from "../../shared/models/enum/Collections";

@Schema({
  collection: Collections.SEASONS,
  autoCreate: true,
  autoIndex: true,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Season {
  @Prop({
    type: Number,
    required: true,
    unique: true,
    index: true,
  })
  number: number;

  @Prop({
    type: Number,
    required: true,
  })
  blockStart: number;

  @Prop({
    type: Number,
    required: true,
    validate: {
      validator: function (v: number) {
        return v > this.blockStart;
      },
      message: "blockEnd must be greater than blockStart",
    },
  })
  blockEnd: number;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  active: boolean;

  @Prop({
    type: String,
    required: true,
  })
  contract: string;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Collections.TASKS,
  })
  tasks: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export type SeasonsDocument = HydratedDocument<Season>;
export const SeasonsSchema = SchemaFactory.createForClass(Season);
