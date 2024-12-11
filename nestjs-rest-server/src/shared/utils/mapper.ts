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
import { DailyCheckInDocument } from "../../db/schemas/DailyCheckIn.schema";
import { DailyCheckinDto } from "../../daily-check-in/dto/DailyCheckinDto";
import { SubscriberObject } from "@mailerlite/mailerlite-nodejs";
import { MaileriteSubscriberDto } from "../../user/dto/mailerite-subscriber.dto";
import { Referral } from "../../db/schemas/Referral.schema";
import { ReferralDto } from "../../referral/dto/referral.dto";

export function formatReferral(value: Referral): ReferralDto {
  return {
    referrerUserAddress: value.referrerUserAddress,
    referredUserAddress: value.referredUserAddress,
    createdAt: value.createdAt,
    isProcessed: value.isProcessed,
  }
}

export function formatMailerliteSubscriber(value: SubscriberObject): MaileriteSubscriberDto {
  return {
    email: value.email,
    created_at: value.created_at,
    status: value.status,
  };
}

export function formatUserSeason(value: IUserSeasonRegistration): UserSeasonResDto {
  return {
    seasonId: value.seasonId.toString(),
    registrationBlock: value.registrationBlock,
  };
}

export function formatDailyCheckIn(dailyCheckIn: DailyCheckInDocument): DailyCheckinDto {
  return {
    walletAddress: dailyCheckIn.walletAddress,
    streakCounter: dailyCheckIn.streakCounter,
    lastCheckIn: dailyCheckIn.lastCheckIn,
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

export function formatUserTaskDocuments(
  task: UserTaskDocument[] | null | undefined,
): FormattedUserTask[] | null | undefined {
  if (!task) return task;

  return task.map((v) => {
    return {
      status: v.status,
      xpEarned: formatXpEarnedDocument(v.xpEarned),
    };
  });
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
