import { Types } from "mongoose";
import { Status } from "../shared/models/enum/Status";
import { Chains } from "../shared/models/enum/Chains";

export class UserSeasonDto {
  constructor(
    public seasonId: Types.ObjectId,
    public registrationBlock: number,
  ) {}
}

export class CreateUserDto {
  constructor(
    public walletAddress: string,
    public registrationBlock: number,
    public updatedAtBlock: number,
    public seasons: UserSeasonDto[],
  ) {}
}

export class XpEarnedDto {
  constructor(
    public xp: number,
    public block: number,
    public period: number,
  ) {}
}

export class CreateUserTaskDto {
  constructor(
    public userId: Types.ObjectId,
    public taskId: Types.ObjectId,
    public seasonId: Types.ObjectId,
    public status: Status,
    public xpEarned: [XpEarnedDto],
    public updatedAtBlock: number,
  ) {}
}

export class UpdateUserTaskDto {
  constructor(
    public status: Status,
    public xpEarned: [XpEarnedDto],
    public updatedAtBlock: number,
  ) {}
}

export class CreateTaskDto {
  constructor(
    public seedId: Types.ObjectId,
    public type: string,
    public description: string,
    public criteria: object,
    public title: string,
    public rewardFormula: [string],
    public chain: Chains,
  ) {}
}

export class CreateSeasonDto {
  constructor(
    public number: number,
    public blockStart: number,
    public blockEnd: number,
    public active: boolean,
    public contract: string,
    public tasks: [Types.ObjectId],
  ) {}
}
