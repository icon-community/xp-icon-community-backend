import { IsBoolean, IsNumber, IsArray, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class UpdateSeasonDto {
  @IsNumber()
  @IsOptional()
  readonly blockStart?: number;

  @IsNumber()
  @IsOptional()
  readonly blockEnd?: number;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;

  @IsArray()
  @IsOptional()
  readonly tasks?: Types.ObjectId[];
}
