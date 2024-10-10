import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LinkSocialDataDto {
  @IsNotEmpty()
  @IsString()
  provider: string;

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
}
