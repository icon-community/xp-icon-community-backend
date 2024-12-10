import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailQueryParam {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
