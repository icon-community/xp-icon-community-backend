//
const { getAllUsers, getUsersBySeason } = require("./userService");
const { getSeasonByNumberId } = require("./seasonService");
const { getUserTaskByAllIds } = require("./userTaskService");
const { getTaskById } = require("./taskService");
const {
  getFormattedUser,
  getFormattedTask,
  getFormattedSeason,
  getFormattedUserTask,
} = require("./utils");
const {
  getRankingOfSeason,
  getRankingOfSeasonReduced,
  getTaskTotalXp,
  sumXp24hrs,
  sumXpTotal,
} = require("./utils2");
const { getIcxBalance } = require("../../utils/json-rpc-services");
const { isValidHex } = require("../../utils/utils");
const config = require("../../utils/config");

//TODO: This function havent been updated to work with
//the latest changes that have been made to the code
async function getUserAllSeasons(userWallet, connection) {
  //
  void userWallet, connection;
  return null;
}

async function getUserBySeason(userWallet, seasonLabel, connection) {
  const seasonDbLabel = config.seasonsRoutes[seasonLabel];

  if (seasonDbLabel == null) {
    throw new Error("Invalid season");
  }

  const allUsers = await getAllUsers(connection);
  const user = allUsers.filter((user) => user.walletAddress === userWallet);
  const userFormatted = getFormattedUser(user);
  if (userFormatted == null) {
    throw new Error("User not found");
  }

  const season = await getSeasonByNumberId(seasonDbLabel, connection);
  const seasonFormatted = getFormattedSeason(season);
  if (seasonFormatted == null) {
    throw new Error("Season not found");
  }

  const tasks = [];
  const userAboveTasks = [];
  const userBelowTasks = [];

  const rankings = await getRankingOfSeason(seasonDbLabel, connection);
  const thisUserIndex = rankings.findIndex((userIndex) =>
    userIndex._id.equals(user[0]._id),
  );
  const userAbove =
    thisUserIndex - 1 < 0 ? null : rankings[thisUserIndex - 1].address;
  const userBelow =
    thisUserIndex + 1 >= rankings.length
      ? null
      : rankings[thisUserIndex + 1].address;

  for (let i = 0; i < seasonFormatted.tasks.length; i++) {
    //
    const taskFromDb = await getTaskById(season[0].tasks[i]._id, connection);
    const formattedTask = getFormattedTask(taskFromDb);
    if (formattedTask == null) {
      console.log("Task not found");
      continue;
    }

    if (userAbove != null) {
      const totalXp = await getTaskTotalXp(
        rankings[thisUserIndex - 1]._id,
        season[0].tasks[i]._id,
        season[0]._id,
        connection,
      );
      userAboveTasks.push({
        task: {
          XPEarned_total_task: totalXp,
        },
      });
    }

    if (userBelow != null) {
      const totalXp = await getTaskTotalXp(
        rankings[thisUserIndex + 1]._id,
        season[0].tasks[i]._id,
        season[0]._id,
        connection,
      );
      userBelowTasks.push({
        task: {
          XPEarned_total_task: totalXp,
        },
      });
    }

    const userTask = await getUserTaskByAllIds(
      user[0]._id,
      season[0].tasks[i]._id,
      season[0]._id,
      connection,
    );

    const formattedUserTask = getFormattedUserTask(userTask);
    if (formattedUserTask == null) {
      console.log("User task not found");
      continue;
    }
    const taskTotalXp = formattedUserTask.xpEarned.reduce(
      (a, b) => a + Number(b.xp),
      0,
    );
    tasks.push({
      task: {
        ...formattedTask,
        XPEarned_total_task: taskTotalXp,
      },
      xp: formattedUserTask,
    });
  }

  const response = {
    user: userFormatted,
    season: {
      ...seasonFormatted,
      Rank: thisUserIndex + 1,
      Address_above: userAbove,
      Address_below: userBelow,
      Address_above_XP: sumXpTotal(userAboveTasks),
      Address_below_XP: sumXpTotal(userBelowTasks),
      XPEarned_total: sumXpTotal(tasks),
      XPEarned_24hrs: sumXp24hrs(tasks),
      tasks: tasks,
    },
  };
  return response;
}

async function getCustomSeasonData(seasonLabel, connection) {
  const seasonDbLabel = config.seasonsRoutes[seasonLabel];

  if (seasonDbLabel == null) {
    throw new Error("Invalid season");
  }

  const season = await getSeasonByNumberId(seasonDbLabel, connection);
  const seasonFormatted = getFormattedSeason(season);
  if (seasonFormatted == null) {
    throw new Error("Season not found");
  }

  const users = await getUsersBySeason(season[0]._id, connection);
  const userCount = users.length;

  let icxBalance = 0;

  const tasks = [];
  for (const task of season[0].tasks) {
    const taskFromDb = await getTaskById(task._id, connection);
    const taskObj = {
      description: taskFromDb[0].description,
      title: taskFromDb[0].title,
    };

    if (taskObj.title === "registration") {
      continue;
    }

    let ammount = 0;
    const formula = new Function(...taskFromDb[0].rewardFormula);
    const divider = formula(1);
    for (let i = 0; i < userCount; i++) {
      // this will only run once, for the first task
      // that way we dont duplicate the icx balance
      const user = users[i];
      if (tasks.length == 0) {
        const icxBalanceUserAsHex = await getIcxBalance(user.walletAddress);

        if (!isValidHex(icxBalanceUserAsHex)) {
          // if the response is not a valid hex, skip this user
          continue;
        }
        icxBalance += parseInt(icxBalanceUserAsHex, 16) / 10 ** 18;
      }

      const userTask = await getUserTaskByAllIds(
        user._id,
        task._id,
        season[0]._id,
        connection,
      );

      if (userTask.length == 0) {
        continue;
      }
      const lastXp =
        userTask[0].xpEarned[userTask[0].xpEarned.length - 1].xp / divider;

      if (!Number.isNaN(lastXp)) {
        ammount += lastXp;
      }
    }

    taskObj.totalLastDay = ammount;

    tasks.push(taskObj);
  }

  const rankings = await getRankingOfSeason(seasonDbLabel, connection);
  const rankingsReduced = getRankingOfSeasonReduced(rankings);
  const response = {
    season: {
      number: seasonFormatted.number,
      blockStart: seasonFormatted.blockStart,
      blockEnd: seasonFormatted.blockEnd,
      userCount: userCount,
      balance_in_wallets: {
        icx: icxBalance,
      },
      task: tasks,
      rank: rankingsReduced,
    },
  };
  return response;
}

async function calculateSeason(
  seasonLabel,
  total,
  baseline,
  filter,
  connection,
) {
  const totalAsNumber = Number(total);
  const baselineAsNumber = Number(baseline);
  if (
    typeof totalAsNumber !== "number" ||
    typeof baselineAsNumber !== "number" ||
    isNaN(totalAsNumber) ||
    isNaN(baselineAsNumber)
  ) {
    throw new Error("Invalid input");
  }

  const filterData = filter == null ? {} : filter;

  const omitFilter = filterData.omit == null ? [] : filterData.omit;
  const seasonDbLabel = config.seasonsRoutes[seasonLabel];
  const rankings = await getRankingOfSeason(seasonDbLabel, connection);
  const rankingsReduced = getRankingOfSeasonReduced(rankings);
  const rankData = [...rankingsReduced];

  if (!Array.isArray(rankData)) {
    throw new Error("Invalid rankings");
  }

  if (
    rankData.length === 0 ||
    !rankData.every((obj) => obj && typeof obj === "object" && "total" in obj)
  ) {
    throw new Error(
      "Rank must be an array of objects with at least one key 'total'",
    );
  }

  const totalPoints = rankData.reduce((acc, obj) => {
    if (omitFilter.includes(obj.address)) {
      return acc;
    }
    return acc + obj.total;
  }, 0);

  let participants = 0;
  for (let key in rankData) {
    if (!omitFilter.includes(rankData[key].address)) {
      participants++;
    }
  }

  if (baselineAsNumber * participants >= totalAsNumber) {
    throw new Error("Baseline is too high");
  }

  const totalWithoutBaseline = totalAsNumber - baselineAsNumber * participants;

  const rewards = rankData.map((obj) => {
    const { total, address } = obj;

    if (omitFilter.includes(address)) {
      return {
        ...obj,
        amount: 0,
      };
    }

    if (typeof total !== "number" || total === 0) {
      return {
        ...obj,
        amount: baselineAsNumber,
      };
    }

    const amount =
      (total / totalPoints) * totalWithoutBaseline + baselineAsNumber;

    return {
      ...obj,
      amount: amount,
    };
  });

  return rewards;
}

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
  getCustomSeasonData,
  calculateSeason,
};
