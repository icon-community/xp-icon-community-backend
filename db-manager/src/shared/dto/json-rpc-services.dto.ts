import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class LastBlockDto {
  @IsNumber()
  height: number;

  @IsNumber()
  time_stamp: number;
}

export class GetNetworkInfoDto {
  @IsString()
  termPeriod: string;
}

export class GetPRepTermDto {
  @IsString()
  sequence: string;

  @IsString()
  period: string;

  @IsString()
  blockHeight: string;

  @IsString()
  endBlockHeight: string;

  @IsString()
  startBlockHeight: string;
}

// DTO for Assets
class AssetDto {
  @IsString()
  bnUSD: string;

  @IsString()
  sICX: string;
}

// DTO for Holding Details
class HoldingDetailsDto {
  @IsString()
  bnUSD: string;
}

// DTO for Holdings
class HoldingsDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HoldingDetailsDto)
  holdings: Record<string, HoldingDetailsDto>;
}

// DTO for Individual Standing
class StandingDetailsDto {
  @IsString()
  collateral: string;

  @IsString()
  collateral_in_USD: string;

  @IsString()
  ratio: string;

  @IsString()
  standing: string;

  @IsString()
  total_debt: string;

  @IsString()
  total_debt_in_USD: string;
}

// DTO for Standings
class StandingsDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StandingDetailsDto)
  standings: Record<string, StandingDetailsDto>;
}

// Main DTO Class
export class GetAccountPositionsDto {
  @IsString()
  address: string;

  @IsOptional()
  assets: AssetDto;

  @IsOptional()
  @IsString()
  collateral: string;

  @IsOptional()
  @IsString()
  created: string;

  @ValidateNested()
  @Type(() => HoldingsDto)
  holdings: HoldingsDto;

  @IsOptional()
  @IsString()
  pos_id: string;

  @IsOptional()
  @IsString()
  ratio: string;

  @IsOptional()
  @IsString()
  standing: string;

  @ValidateNested()
  @Type(() => StandingsDto)
  standings: StandingsDto;

  @IsOptional()
  @IsString()
  total_debt: string;
}
