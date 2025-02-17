import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
  ArrayUnique,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from "mongoose";
import { LinkWalletDto } from "./link-wallet.dto";

class SeasonDto {
  @IsMongoId()
  seasonId: ObjectId;

  @IsNumber()
  registrationBlock: number;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  walletAddress?: string;

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
  updatedAt?: Date;
}
