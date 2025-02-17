import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
  ArrayUnique,
} from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongoose";
import { LinkWalletDto } from "./link-wallet.dto";

class SeasonDto {
  @IsString()
  seasonId: ObjectId;

  @IsNumber()
  registrationBlock: number;
}

export class CreateUserDto {
  @IsString()
  walletAddress: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkWalletDto)
  @ArrayUnique((wallet: LinkWalletDto) => wallet.address)
  @IsOptional()
  linkedWallets?: LinkWalletDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeasonDto)
  @IsOptional()
  seasons?: SeasonDto[];

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
