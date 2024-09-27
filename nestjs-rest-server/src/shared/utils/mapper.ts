import { TaskDocument } from "../../db/schemas/Task.schema";
import {
  FormattedSeason,
  FormattedTask,
  FormattedUser,
  FormattedUserTask,
  FormattedXpEarned,
} from "../models/types/FormattedTypes";
import { UserTaskDocument, XpEarned } from "../../db/schemas/UserTask.schema";
import { UserDocument } from "../../db/schemas/User.schema";
import { SeasonsDocument } from "../../db/schemas/Seasons.schema";
import { UserDto } from "../../user/dto/user.dto";

export function formatUser(user: UserDocument): UserDto {
  return {
    seasons: user.seasons,
    referralCode: user.referralCode,
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

export function formatXpEarnedDocument(xpArray: XpEarned[]): FormattedXpEarned[] {
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

export function formatSeasonDocument(season: SeasonsDocument | null | undefined): FormattedSeason | null | undefined {
  if (!season) return season;

  return {
    number: season.number,
    blockStart: season.blockStart,
    blockEnd: season.blockEnd,
    active: season.active,
    tasks: season.tasks,
    XPEarned_total: null,
    XPEarned_24hrs: null,
    Rank: null,
    Address_above: null,
    Address_below: null,
  };
}
