import { FormattedTask, FormattedUserTask } from "../models/types/FormattedTypes";
import { UserTaskDocument } from "../../db/schemas/UserTask.schema";

export function sumXpTotal(arrayOfTasks: { task: { XPEarned_total_task: number } }[]): number {
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
): number {
  if (arrayOfTasks.length === 0) {
    return 0;
  }
  return arrayOfTasks.reduce((a, b) => a + b.xp.xpEarned[b.xp.xpEarned.length - 1].xp, 0);
}

export function calculateTaskTotalXp(userTasks: (UserTaskDocument | FormattedUserTask)[] | null): number {
  if (userTasks == null || userTasks.length == 0) {
    return 0;
  }

  return userTasks.reduce((sum, task) => sum + task.xpEarned.reduce((a, b) => a + Number(b.xp), 0), 0);
}
