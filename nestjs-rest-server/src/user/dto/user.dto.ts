import { UserSeason } from "../../db/schemas/User.schema";

export class UserDto {
  seasons: UserSeason[];

  referralCode: string;
}
