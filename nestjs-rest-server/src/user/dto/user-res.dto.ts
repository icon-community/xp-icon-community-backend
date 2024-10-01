import { UserSeasonResDto } from "./user-season-res.dto";

export class UserResDto {
  seasons: UserSeasonResDto[];
  referralCode: string;
  createdAt: number;
  walletAddress: string;
}
