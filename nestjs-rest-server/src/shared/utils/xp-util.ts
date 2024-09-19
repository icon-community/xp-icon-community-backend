import { FormattedTask, FormattedUserTask } from "../models/types/FormattedTypes";

export function sumXpTotal(arrayOfTasks: { task: { XPEarned_total_task: number } }[]) {
  if (arrayOfTasks.length === 0) {
    return 0;
  }
  return arrayOfTasks.reduce((a, b) => a + b.task.XPEarned_total_task, 0);
}

export function sumXp24hrs(
  arrayOfTasks: {
    task: FormattedTask & {
      XPEarned_total_task: number;
    };
    xp: FormattedUserTask;
  }[],
) {
  if (arrayOfTasks.length === 0) {
    return 0;
  }
  return arrayOfTasks.reduce((a, b) => a + b.xp.xpEarned[b.xp.xpEarned.length - 1].xp, 0);
}
