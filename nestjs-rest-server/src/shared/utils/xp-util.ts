import { FormattedTask, FormattedUserTask } from "../models/types/FormattedTypes";
import { UserTaskDocument } from "../../db/schemas/UserTask.schema";

export function sumXpTotal(arrayOfTasks: { task: { XPEarned_total_task: number } }[]): number {
  try {
    if (arrayOfTasks.length === 0) {
      return 0;
    }
    return arrayOfTasks.reduce((a, b) => a + b.task.XPEarned_total_task, 0);
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export function sumXp24hrs(
  arrayOfTasks: {
    xp: FormattedUserTask;
  }[],
): number {
  try {
    if (!arrayOfTasks || arrayOfTasks.length === 0) {
      return 0;
    }

    let lastTerm = 0;
    let maxArrayLength = 0;

    for (const task of arrayOfTasks) {
      if (task.xp.xpEarned?.length > maxArrayLength) {
        maxArrayLength = task.xp.xpEarned.length;
      }

      for (const xpEarned of task.xp.xpEarned || []) {
        if (xpEarned.period != null) {
          lastTerm = Math.max(lastTerm, xpEarned.period);
        }
      }
    }

    if (maxArrayLength === 0) {
      return 0;
    }

    let sum = 0;

    if (maxArrayLength === 1) {
      sum = arrayOfTasks.reduce((a, b) => {
        let bValidated = 0;
        if (b.xp.xpEarned.length > 0) {
          if (b.xp.xpEarned[b.xp.xpEarned.length - 1].xp != null) {
            bValidated = b.xp.xpEarned[b.xp.xpEarned.length - 1].xp ?? 0;
          }
        }
        return a + bValidated;
      }, 0);
    } else {
      sum = arrayOfTasks.reduce((a, b) => {
        let bValidated = 0;
        if (b.xp.xpEarned.length > 0) {
          const lastXpObj = b.xp.xpEarned.find((xpEarned) => xpEarned.period === lastTerm);
          if (lastXpObj != null) {
            bValidated = lastXpObj.xp ?? 0;
          }
        }
        return a + bValidated;
      }, 0);
    }

    return sum;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export function calculateTaskTotalXp(userTasks: (UserTaskDocument | FormattedUserTask)[] | null): number {
  if (userTasks == null || userTasks.length == 0) {
    return 0;
  }

  let totalXp = 0;
  for (const userTask of userTasks) {
    let taskXpSum = 0;
    for (const xpEarned of userTask.xpEarned) {
      if (xpEarned.xp == null) {
        continue;
      }
      taskXpSum += xpEarned.xp;
    }
    totalXp += taskXpSum;
  }

  return totalXp;
}
