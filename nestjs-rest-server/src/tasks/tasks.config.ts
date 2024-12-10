import { ChainType } from "../shared/models/enum/ChainType";

export enum TaskLabel {
  HANA_NEWSLETTER = "HANA_NEWSLETTER", // Hana Newsletter
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
    rewardFormula: ["amount", "return 420"],
    chain: ChainType.icon,
  },
};
