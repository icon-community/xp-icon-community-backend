const {
  getXChainCollateralInUSDValue,
} = require("../common/utils/json-rpc-services");
const {
  userService,
  taskService,
  seasonService,
  userTaskService,
} = require("../common/services/v1/");
const { chains, tasks } = require("../common/utils/config");
const {
  getUserDailyCheckIn,
} = require("../common/services/v1/dailyCheckInService");
const { getActiveSeason } = seasonService;
const { getTaskBySeedId } = taskService;
const { getUsersBySeason } = userService;
const { getUserTaskByAllIds, updateOrCreateUserTask } = userTaskService;

// Daily check in task using consecutive streak count and deposited cross-chain collateral to calculate daily xp
const SEED_ID = tasks.dailyCheckIn;

async function dailyCheckInTask(taskInput, db) {
  try {
    console.log("========");
    console.log("> Running dailyCheckInTask task on block ${height}");

    const { height, prepTerm } = taskInput;

    console.log("- Creating connection to DB");
    await db.createConnection();

    // Fetch active seasons
    console.log("- Fetching active seasons");
    const activeSeasonArr = await getActiveSeason(db.connection);

    if (activeSeasonArr && activeSeasonArr.length > 0) {
      for (const activeSeason of activeSeasonArr) {
        console.log(`-- Active season: ${activeSeason._id}`);

        if (
          height < activeSeason.blockStart ||
          height > activeSeason.blockEnd
        ) {
          console.log(
            `-- Current block height ${height} is not within the range of active season ${activeSeason._id} with start block height ${activeSeason.blockStart} and end block height ${activeSeason.blockEnd}`,
          );
          continue;
        }

        console.log(`-- Find target task with seedId === ${SEED_ID}`);
        const targetTaskArr = await getTaskBySeedId(SEED_ID, db.connection);
        const targetTask =
          targetTaskArr && targetTaskArr.length > 0
            ? targetTaskArr[0]
            : undefined;

        if (!targetTask) {
          console.error("Target task not found");
          continue;
        }

        const taskFound = activeSeason.tasks.find((taskId) =>
          taskId.equals(targetTask._id),
        );

        if (!taskFound) {
          console.log(
            `--- Target task not found in active tasks. This active season doesnt have a task associated with seedId === ${SEED_ID}, continue querying the next active season`,
          );
          continue;
        }

        const usersFromDb = await getUsersBySeason(
          activeSeason._id,
          db.connection,
        );

        if (usersFromDb.length === 0) {
          console.log("--- No users found in DB with specified seasonId");
          continue;
        }

        console.log("-- Filtering users by registration block");
        const filteredUsers = [];
        for (const user of usersFromDb) {
          const targetSeason = user.seasons.find((season) =>
            season.seasonId.equals(activeSeason._id),
          );
          const registrationBlock =
            targetSeason == null ? null : targetSeason.registrationBlock;

          if (registrationBlock == null) {
            throw new Error("---- registrationBlock is null");
          }

          if (registrationBlock <= height) {
            filteredUsers.push(user);
          }
        }

        if (filteredUsers.length === 0) {
          console.log(
            "--- No users found in DB with registration block less than or equal to current block height",
          );
          continue;
        }

        for (const validUser of filteredUsers) {
          const xpArray = [];

          if (
            !validUser.linkedWallets ||
            validUser.linkedWallets.length === 0
          ) {
            console.log(
              `--- User ${validUser._id} does not have any linked wallet`,
            );
            continue;
          }

          const userTaskDocArr = await getUserTaskByAllIds(
            validUser._id,
            targetTask._id,
            activeSeason._id,
            db.connection,
          );

          if (
            userTaskDocArr &&
            userTaskDocArr[0] &&
            userTaskDocArr[0].xpEarned != null &&
            userTaskDocArr[0].xpEarned.length
          ) {
            const alreadyExists = userTaskDocArr[0].xpEarned.find(
              (xpEarned) => {
                return xpEarned.period === prepTerm;
              },
            );

            if (!alreadyExists) {
              xpArray.push(...userTaskDocArr[0].xpEarned);
            } else {
              // user already earned xp in this term, skip
              continue;
            }
          }

          // calculate total daily check in xp as: XP = 1 + (streak count/100) * (value of deposited collateral in USD) / 2
          let totalDailyXp = 0;

          const allXCallAddresses = [];
          validUser.linkedWallets.forEach(xChainWallet => {
            if (xChainWallet.type === "evm") {
              allXCallAddresses.push(...chains.evm.map(chain => `${chain}/${xChainWallet.address}`));
            } else if (["sui", "stellar"].includes(xChainWallet.type)) {
              allXCallAddresses.push(`${xChainWallet.type}/${xChainWallet.address}`)
            }
          })

          for (const xCallAddress of allXCallAddresses) {
            const depositedCollateralUsd =
              await getXChainCollateralInUSDValue(xCallAddress, height);

            if (depositedCollateralUsd && depositedCollateralUsd > 0) {
              const dailyCheckInDoc = await getUserDailyCheckIn(
                validUser._id,
                db.connection,
              );

              if (!dailyCheckInDoc || dailyCheckInDoc.streakCounter === 0) {
                console.log(
                  `-- dailyCheckInDoc undefined or streakCounter is 0, skipping ${xCallAddress} --`,
                );
                continue;
              }

              // add collateral
              totalDailyXp += Math.round(
                1 +
                (dailyCheckInDoc.streakCounter / 100) *
                (depositedCollateralUsd / 2),
              );
            } else {
              console.log(`-- depositedCollateralUsd undefined or 0 --`);
            }
          }

          xpArray.push({
            period: prepTerm,
            block: height,
            xp: totalDailyXp,
          });

          await updateOrCreateUserTask(
            {
              userId: validUser._id,
              taskId: targetTask._id,
              seasonId: activeSeason._id,
              walletAddress: validUser.walletAddress,
            },
            { xpEarned: xpArray },
            db.connection,
          );
          console.log("--- UserTask document updated");
        }
      }
    } else {
      console.log("- No active season found. Closing DB connection.");
      await db.stop();
    }
  } catch (err) {
    console.log("Error running dailyCheckInTask");
    console.log(err);
  }
}

module.exports = dailyCheckInTask;
