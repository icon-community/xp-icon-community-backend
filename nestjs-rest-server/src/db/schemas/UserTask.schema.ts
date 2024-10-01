import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Status } from "../../shared/models/enum/Status";
import { Collections } from "../../shared/models/enum/Collections";

@Schema({
  _id: false,
})
export class XpEarned {
  @Prop({
    type: Number,
    required: true,
  })
  xp: number;

  @Prop({
    type: Number,
    required: true,
  })
  block: number;

  @Prop({
    type: Number,
    required: true,
  })
  period: number;
}

export type XpEarnedDocument = HydratedDocument<XpEarned>;
export const XpEarnedSchema = SchemaFactory.createForClass(XpEarned);

@Schema({
  collection: Collections.USER_TASKS,
  autoCreate: true,
  autoIndex: true,
  timestamps: {
    createdAt: true,
  },
})
export class UserTask {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Collections.USERS,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Collections.TASKS,
    required: true,
  })
  taskId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Collections.SEASONS,
    required: true,
  })
  seasonId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Prop({
    type: [XpEarnedSchema],
  })
  xpEarned: XpEarned[];

  @Prop({
    type: Number,
    required: true,
  })
  updatedAtBlock: number;

  createdAt: Date;
}

export type UserTaskQuery = {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  seasonId: Types.ObjectId;
};
export type UserTaskDocument = HydratedDocument<UserTask>;
export const UserTaskSchema = SchemaFactory.createForClass(UserTask);

// define user,task and season ID as compound index
UserTaskSchema.index({ userId: 1, taskId: 1, seasonId: 1 }, { unique: true });
