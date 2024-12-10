import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class FindUserReferralsQuery {
  @Type(() => Date)
  @IsDate()
  start: Date;

  @Type(() => Date)
  @IsDate()
  end: Date;
}
