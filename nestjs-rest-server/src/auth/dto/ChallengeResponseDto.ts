import { IsString, Length, MinLength } from "class-validator";

export class ChallengeResponseDto {
  @IsString()
  @Length(42)
  address: string;

  @IsString()
  @MinLength(10)
  signature: string;
}
