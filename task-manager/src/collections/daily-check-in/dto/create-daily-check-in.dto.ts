import { IsString, IsNumber, IsDate, IsOptional } from "class-validator";

export class CreateDailyCheckInDto {
  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsNumber()
  streakCounter?: number;

  @IsOptional()
  @IsDate()
  lastCheckIn?: Date;
}
