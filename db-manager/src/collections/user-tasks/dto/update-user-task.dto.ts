import { IsString, IsEnum, IsMongoId, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

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

export class UpdateUserTaskDto {
  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  taskId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  seasonId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'completed', 'failed'])
  status?: 'pending' | 'completed' | 'failed';

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => XpEarnedDto)
  xpEarned?: XpEarnedDto[];
}
