import { Document, ObjectId } from 'mongoose';

export interface Seasons extends Document {
  _id: ObjectId;
  number: number;
  blockStart: number;
  blockEnd: number;
  active: boolean;
  contract: string;
  tasks: ObjectId[];
}
