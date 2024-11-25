import { SeasonLabel } from "../../shared/models/enum/SeasonLabel";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterSeasonDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  seasonLabel: SeasonLabel;
}
