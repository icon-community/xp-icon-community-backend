import { IsArray, IsNumber, IsOptional } from "class-validator";

class Filter {
  @IsOptional()
  @IsArray()
  omit?: string[];
}

export class CalculateSeasonReqDto {
  @IsNumber()
  total: string;

  @IsNumber()
  baseline: string;

  @IsOptional()
  filter?: Filter;
}
