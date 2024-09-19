import { SeasonLabel } from "../models/enum/SeasonLabel";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class SeasonLabelParam {
  @IsNotEmpty()
  @IsEnum(SeasonLabel)
  seasonLabel: SeasonLabel;
}

export class TaskBySeasonParams {
  @IsNotEmpty()
  @IsEnum(SeasonLabel)
  seasonLabel: SeasonLabel;

  @IsNotEmpty()
  @IsString()
  taskLabel: string;
}
