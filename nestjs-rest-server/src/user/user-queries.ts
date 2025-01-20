import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SeasonLabel } from "src/shared/models/enum/SeasonLabel";

export class EmailQueryParam {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ReferralQueryParam {
  @IsOptional()
  @IsEnum(SeasonLabel)
  seasonLabel: SeasonLabel;

  @IsOptional()
  @IsString()
  referralCode: string;
}
