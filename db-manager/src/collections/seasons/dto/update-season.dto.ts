import {
  IsBoolean,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Types, ObjectId } from 'mongoose';

export class UpdateSeasonDto {
  @IsOptional()
  @IsMongoId()
  readonly _id?: ObjectId;

  @IsNumber()
  @IsOptional()
  readonly number?: number;

  @IsNumber()
  @IsOptional()
  readonly blockStart?: number;

  @IsNumber()
  @IsOptional()
  readonly blockEnd?: number;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;

  @IsString()
  @IsOptional()
  readonly contract?: string;

  @IsArray()
  @IsOptional()
  readonly tasks?: Types.ObjectId[];
}
