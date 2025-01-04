import { Document, ObjectId } from 'mongoose';
export interface Tasks extends Document {
  _id: ObjectId | string;
  seedId: string;
  type: string;
  description: string;
  criteria: any; // Replace `any` with a specific type if possible
  title: string;
  rewardFormula: string[];
  createdAt?: Date;
  chain: 'icon' | 'evm';
}
