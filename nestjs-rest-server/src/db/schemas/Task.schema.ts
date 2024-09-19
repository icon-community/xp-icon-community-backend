import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Chains } from "../../shared/models/enum/Chains";
import { Collections } from "../../shared/models/enum/Collections";

@Schema({
  collection: Collections.TASKS,
  autoCreate: true,
  autoIndex: true,
  timestamps: {
    createdAt: true,
  },
})
export class Task {
  @Prop({
    type: String,
    required: true,
  })
  seedId: string;

  @Prop({
    type: String,
    required: true,
  })
  type: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  criteria: object;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: [String],
    required: true,
  })
  rewardFormula: [string];

  @Prop({
    type: String,
    enum: Chains,
    required: true,
  })
  chain: Chains;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
