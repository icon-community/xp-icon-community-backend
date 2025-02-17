import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterToSeasonDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  registrationBlock: number;
}
