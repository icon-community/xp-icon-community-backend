import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayNotEmpty,
  IsArray,
} from "class-validator";
import { Types } from "mongoose";

export class TaskReferenceDto {
  @IsNotEmpty()
  @IsString()
  readonly id: Types.ObjectId;
}

export class CreateSeasonDto {
  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsNumber()
  @IsNotEmpty()
  readonly blockStart: number;

  @IsNumber()
  @IsNotEmpty()
  readonly blockEnd: number;

  @IsBoolean()
  readonly active: boolean;

  @IsArray()
  @ArrayNotEmpty()
  readonly tasks: Types.ObjectId[];
}
