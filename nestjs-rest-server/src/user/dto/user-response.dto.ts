import { UserSeasonResDto } from "./user-season-res.dto";
import { UserLinkedSocial } from "./user-linked-socials.dto";
import { UserLinkedWalletsDto } from "./user-linked-wallets.dto";

export class UserResponseDto {
  seasons: UserSeasonResDto[];
  referralCode: string;
  createdAt: number;
  walletAddress: string;
  linkedSocials: UserLinkedSocial[];
  linkedWallets: UserLinkedWalletsDto[];
}
