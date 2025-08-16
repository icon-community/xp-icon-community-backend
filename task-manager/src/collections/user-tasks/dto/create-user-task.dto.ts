import {
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";

class XpEarnedDto {
  @IsNumber()
  xp: number;

  @IsNumber()
  block: number;

  @IsNumber()
  period: number;

  @IsOptional()
  details?: any;
}

export class CreateUserTaskDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  taskId: Types.ObjectId;

  @IsMongoId()
  seasonId: Types.ObjectId;

  @IsString()
  @IsEnum(["pending", "completed", "failed"])
  status: "pending" | "completed" | "failed";

  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => XpEarnedDto)
  xpEarned?: XpEarnedDto[];
}
