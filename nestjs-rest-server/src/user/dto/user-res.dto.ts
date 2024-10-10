import { UserSeasonResDto } from "./user-season-res.dto";
import { UserLinkedSocial } from "./user-linked-socials.dto";

export class UserResDto {
  seasons: UserSeasonResDto[];
  referralCode: string;
  createdAt: number;
  walletAddress: string;
  linkedSocials: UserLinkedSocial[];
}
