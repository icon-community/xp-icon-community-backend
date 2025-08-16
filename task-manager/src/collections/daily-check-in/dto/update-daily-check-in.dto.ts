import { IsString, IsNumber, IsDate, IsOptional } from "class-validator";

export class UpdateDailyCheckInDto {
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsNumber()
  streakCounter?: number;

  @IsOptional()
  @IsDate()
  lastCheckIn?: Date;
}
