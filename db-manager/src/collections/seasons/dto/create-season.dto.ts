import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

export class TaskReferenceDto {
  @IsNotEmpty()
  @IsString()
  readonly id: Types.ObjectId;
}

export class CreateSeasonDto {
  @IsNumber()
  @IsNotEmpty()
  readonly number: number;

  @IsNumber()
  @IsNotEmpty()
  readonly blockStart: number;

  @IsNumber()
  @IsNotEmpty()
  readonly blockEnd: number;

  @IsBoolean()
  readonly active: boolean;

  @IsString()
  @IsNotEmpty()
  readonly contract: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly tasks: Types.ObjectId[];
}
