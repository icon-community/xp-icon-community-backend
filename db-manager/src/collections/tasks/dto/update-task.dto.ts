import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

import { ObjectId } from 'mongoose';

export class UpdateTaskDto {
  @IsMongoId()
  @IsOptional()
  _id?: ObjectId;

  @IsString()
  seedId?: string;

  @IsString()
  type?: string;

  @IsString()
  description?: string;

  @IsOptional()
  criteria?: any; // Replace `any` with a more specific type if possible.

  @IsString()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  rewardFormula?: string[];

  @IsOptional()
  createdAt?: Date;

  @IsEnum(['icon', 'evm'])
  chain?: 'icon' | 'evm';
}
