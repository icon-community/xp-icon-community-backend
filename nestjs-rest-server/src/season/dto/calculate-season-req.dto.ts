import { IsArray, IsNumber, IsOptional } from "class-validator";

class Filter {
  @IsOptional()
  @IsArray()
  omit?: string[];
}

export class CalculateSeasonReqDto {
  @IsNumber()
  total: number;

  @IsNumber()
  baseline: number;

  @IsOptional()
  filter?: Filter;
}
