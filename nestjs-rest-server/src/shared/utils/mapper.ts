import { TaskDocument } from "../../db/schemas/Task.schema";
import {
  FormattedSeason,
  FormattedTask,
  FormattedUser,
  FormattedUserTask,
  FormattedXpEarned,
} from "../models/types/FormattedTypes";
import { UserTaskDocument, IXpEarned } from "../../db/schemas/UserTask.schema";
import { UserDocument, IUserSeasonRegistration } from "../../db/schemas/User.schema";
import { SeasonsDocument } from "../../db/schemas/Seasons.schema";
import { UserSeasonResDto } from "../../user/dto/user-season-res.dto";
import { UserResponseDto } from "../../user/dto/user-response.dto";

export function formatUserSeason(value: IUserSeasonRegistration): UserSeasonResDto {
  return {
    seasonId: value.seasonId.toString(),
    registrationBlock: value.registrationBlock,
  };
}

export function formatUser(user: UserDocument): UserResponseDto {
  return {
    seasons: user.seasons.map((v) => formatUserSeason(v)),
    referralCode: user.referralCode,
    createdAt: user.createdAt.getTime(),
    walletAddress: user.walletAddress,
    linkedSocials: user.linkedSocials.map((v) => {
      return {
        provider: v.provider,
        name: v.name,
        email: v.email,
        imageUrl: v.imageUrl,
      };
    }),
    linkedWallets: user.linkedWallets.map((v) => {
      return {
        address: v.address,
        type: v.type,
      };
    }),
  };
}

export function formatTaskDocument(task: TaskDocument | null | undefined): FormattedTask | null | undefined {
  if (!task) return task;

  return {
    // _id: task._id,
    type: task.type,
    title: task.title,
    description: task.description,
    chain: task.chain,
    rewardFormula: task.rewardFormula,
  };
}

export function formatXpEarnedDocument(xpArray: IXpEarned[]): FormattedXpEarned[] {
  if (xpArray.length == 0) {
    return [];
  }

  return xpArray.map((xp) => {
    return {
      xp: xp.xp,
      block: xp.block,
      period: xp.period,
    };
  });
}

export function formatUserTaskDocument(
  task: UserTaskDocument | null | undefined,
): FormattedUserTask | null | undefined {
  if (!task) return task;

  return {
    // _id: task._id,
    status: task.status,
    xpEarned: formatXpEarnedDocument(task.xpEarned),
  };
}

export function formatUserDocument(user: UserDocument | null | undefined): FormattedUser | null | undefined {
  if (!user) return user;

  return {
    // _id: user._id,
    walletAddress: user.walletAddress,
  };
}

export function formatSeasonDocument(season: SeasonsDocument): FormattedSeason {
  if (!season) return season;

  return {
    number: season.number,
    blockStart: season.blockStart,
    blockEnd: season.blockEnd,
    active: season.active,
    XPEarned_total: null,
    XPEarned_24hrs: null,
    Rank: null,
    Address_above: null,
    Address_below: null,
  };
}
