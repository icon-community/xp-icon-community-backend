import { IsString, MinLength } from "class-validator";

export class ChallengeRequestDto {
  @IsString()
  @MinLength(10)
  message: string;
}
