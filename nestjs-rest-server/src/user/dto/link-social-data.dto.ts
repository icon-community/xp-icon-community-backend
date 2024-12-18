import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SeasonLabel } from "../../shared/models/enum/SeasonLabel";
import { SocialProvider } from "../../shared/models/enum/SocialProvider";

export class LinkSocialDataDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @IsNotEmpty()
  @IsString()
  providerAccountId: string;

  @IsNotEmpty()
  @IsString()
  name: string | null | undefined;

  @IsOptional()
  @IsString()
  email: string | null | undefined;

  @IsOptional()
  @IsString()
  imageUrl: string | null | undefined;

  @IsEnum(SeasonLabel)
  seasonLabel: SeasonLabel;
}
