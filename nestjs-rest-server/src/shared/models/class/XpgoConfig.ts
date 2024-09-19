import { Env } from "../enum/Env";
import {
  Contains,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { LogLevel } from "../enum/LogLevel";
import { IconNetwork } from "../enum/IconNetworks";

export class MongoConfig {
  @IsString()
  @IsNotEmpty()
  dbName: string;

  @IsString()
  @IsNotEmpty()
  @Contains("mongodb")
  url: string;
}

export class XpgoConfig {
  @IsEnum(Env)
  env: Env;

  @IsEnum(LogLevel)
  logLevel: LogLevel;

  @IsNumber()
  @Min(0)
  port: number;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @Type(() => MongoConfig)
  mongoConfig: MongoConfig;

  @IsEnum(IconNetwork)
  @IsDefined()
  iconNetwork: IconNetwork;

  @IsString()
  authServerUrl: string;
}
