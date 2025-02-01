import { IsString, IsBoolean, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateReferralDto {
  @IsString()
  referrerUserAddress: string;

  @IsString()
  referredUserAddress: string;

  @IsString()
  referralCode: string;

  @IsMongoId()
  referrerUserId: Types.ObjectId;

  @IsMongoId()
  referredUserId: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  referrerIsProcessed?: boolean;

  @IsOptional()
  @IsBoolean()
  referredIsProcessed?: boolean;
}
