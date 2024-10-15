import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ChainType } from "../../shared/models/enum/ChainType";

export class LinkEvmWalletDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(ChainType)
  @IsNotEmpty()
  type: ChainType;

  @IsString()
  @IsNotEmpty()
  evmAccessToken: string;
}
