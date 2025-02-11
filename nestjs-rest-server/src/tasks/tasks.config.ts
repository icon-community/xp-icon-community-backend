import { ChainType } from "../shared/models/enum/ChainType";

export enum TaskLabel {
  HANA_NEWSLETTER = "HANA_NEWSLETTER", // Hana Newsletter
  LINK_TWITTER_X = "LINK_TWITTER_X",
  LINK_GOOGLE = "LINK_GOOGLE",
}

export enum TaskType {
  NON_RECURSIVE = "NON_RECURSIVE",
}

export interface TaskConfig {
  seedId: TaskLabel;
  type: TaskType;
  description: string;
  criteria: [];
  title: string;
  rewardFormula: [string, string];
  chain: ChainType;
}

export const tasks: Record<TaskLabel, TaskConfig> = {
  [TaskLabel.HANA_NEWSLETTER]: {
    seedId: TaskLabel.HANA_NEWSLETTER,
    type: TaskType.NON_RECURSIVE,
    description: "One time reward for subscribing linked email to hana newsletter",
    criteria: [],
    title: "hana newsletter",
    rewardFormula: ["amount", "return 3000"],
    chain: ChainType.icon,
  },
  [TaskLabel.LINK_TWITTER_X]: {
    seedId: TaskLabel.LINK_TWITTER_X,
    type: TaskType.NON_RECURSIVE,
    description: "One time reward for linking X account",
    criteria: [],
    title: "Link X account",
    rewardFormula: ["amount", "return 3000"],
    chain: ChainType.icon,
  },
  [TaskLabel.LINK_GOOGLE]: {
    seedId: TaskLabel.LINK_GOOGLE,
    type: TaskType.NON_RECURSIVE,
    description: "One time reward for linking Google account",
    criteria: [],
    title: "Link Google account",
    rewardFormula: ["amount", "return 3000"],
    chain: ChainType.icon,
  },
};
