import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  ValidateNested,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

class LinkedWalletDto {
  @IsString()
  address: string;

  @IsEnum(['evm', 'icon'])
  type: 'evm' | 'icon';
}

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
  @Type(() => LinkedWalletDto)
  @ArrayUnique((wallet: LinkedWalletDto) => wallet.address)
  @IsOptional()
  linkedWallets?: LinkedWalletDto[];

  @IsNumber()
  @IsOptional()
  dailyCheckInStreak?: number;

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
