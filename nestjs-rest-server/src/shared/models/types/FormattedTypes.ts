import { Chains } from "../enum/Chains";
import { Status } from "../enum/Status";

export type FormattedTask = {
  // _id: task[0]._id,
  type: string;
  title: string;
  description: string;
  chain: Chains;
  rewardFormula: [string];
};

export type FormattedXpEarned = {
  xp: number;
  block: number;
  period: number;
};

export type FormattedUserTask = {
  // _id: Types.ObjectId,
  status: Status;
  xpEarned: FormattedXpEarned[];
};

export type FormattedUserBySeasonTask = {
  task: FormattedTask & {
    XPEarned_total_task: number;
  };
  xp: FormattedUserTask;
};

export type FormattedUser = {
  walletAddress: string;
};

export type FormattedSeason = {
  number: number;
  blockStart: number;
  blockEnd: number;
  active: boolean;
  XPEarned_total: null | number;
  XPEarned_24hrs: null | number;
  Rank: null | number;
  Address_above: null | string;
  Address_below: null | string;
};

export type FormattedUserBySeason = {
  tasks: FormattedUserBySeasonTask[];
  Rank: number;
  Address_above: string | null;
  Address_below: string | null;
  Address_above_XP: number;
  Address_below_XP: number;
  XPEarned_total: number;
  XPEarned_24hrs: number;
};

export type FormattedUserSeason = {
  user: FormattedUser | null;
  season: FormattedSeason & FormattedUserBySeason;
};
