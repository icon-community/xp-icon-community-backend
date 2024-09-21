import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class FindUserReferralsQueryDTO {
  @Type(() => Date)
  @IsDate()
  start: Date;

  @Type(() => Date)
  @IsDate()
  end: Date;
}
