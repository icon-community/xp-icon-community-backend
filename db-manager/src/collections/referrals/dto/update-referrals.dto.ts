import { IsString, IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateReferralDto {
  @IsOptional()
  @IsString()
  referrerUserAddress?: string;

  @IsOptional()
  @IsString()
  referredUserAddress?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsOptional()
  @IsMongoId()
  referrerUserId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  referredUserId?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  referrerIsProcessed?: boolean;

  @IsOptional()
  @IsBoolean()
  referredIsProcessed?: boolean;
}
