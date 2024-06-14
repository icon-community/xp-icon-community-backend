// This task is defined for the purpose of fetching
// balanced related data (collateral, loans, etc) from
// the blockchain and updating the database with the
// latest amounts.
const {
  userService,
  taskService,
  seasonService,
  userTaskService,
} = require("../../common/services/v1/");
const { getUsersBySeason } = userService;
const { getActiveSeason } = seasonService;
const { getTaskBySeedId } = taskService;
const { getUserTaskByAllIds, updateOrCreateUserTask } = userTaskService;

async function genericTask(taskInput, db, seedId, callback) {
  const { height, prepTerm } = taskInput;
  const SEED_ID = seedId;
  console.log(`> Running genericTask on block ${height}`);

  try {
    console.log("Creating connection to DB");
    await db.createConnection();

    // Fetch active season
    console.log("Fetching active seasons");
    const activeSeasonArr = await getActiveSeason(db.connection);

    if (activeSeasonArr.length === 0) {
      console.log("No active season found");
      console.log("Closing connection to DB");
      await db.stop();
      return;
    }

    for (const activeSeason of activeSeasonArr) {
      console.log(`Active season: ${activeSeason._id}`);

      // fetch activeSeason contract
      const activeSeasonContract = activeSeason.contract;
      console.log(`Active season contract: ${activeSeasonContract}`);

      // Fetch active season tasks
      console.log("Fetching active season tasks");
      const activeTasks = activeSeason.tasks;

      // For each task in the active season find the task with seedId === "t1"
      console.log(`Find target task with seedId === ${SEED_ID}`);
      const targetTaskArr = await getTaskBySeedId(SEED_ID, db.connection);
      const targetTask = targetTaskArr[0];

      console.log("Checking if target task is in active tasks");
      let taskFound = false;
      for (const taskId of activeTasks) {
        if (taskId.equals(targetTask._id)) {
          console.log("Found target task");
          taskFound = true;
          break;
        }
      }

      if (!taskFound) {
        console.log(
          `Target task not found in active tasks. This active season doesnt have a task associated with seedId === ${SEED_ID}`,
        );
        console.log("Closing connection to DB");
        await db.stop();
        return;
      }

      console.log("Target task found in active tasks");
      const rewardFormula = new Function(...targetTask.rewardFormula);

      // FIRST fetch data from the database
      // Fetch all the users with a defined seasonId
      console.log("Fetching users from DB");
      const usersFromDb = await getUsersBySeason(
        activeSeason._id,
        db.connection,
      );

      // filter user by their registration block. if the user's registration block is greater than the current block height, skip the user
      //
      if (usersFromDb.length === 0) {
        console.log("No users found in DB with specified seasonId");
        // no user found in the database with the
        // specified seasonId, this means no user has
        // yet registered for this season, we skip the
        // season and continue with the other seasons
        continue;
      }

      // we filter the users by their registration block
      // if the user's registration block is greater than
      // the current block height, we skip the user
      console.log("Filtering users by registration block");

      const filteredUsers = [];

      for (const user of usersFromDb) {
        const targetSeason = user.seasons.find((season) =>
          season.seasonId.equals(activeSeason._id),
        );
        const registrationBlock =
          targetSeason == null ? null : targetSeason.registrationBlock;

        if (registrationBlock == null) {
          throw new Error("registrationBlock is null");
        }

        if (registrationBlock <= height) {
          filteredUsers.push(user);
        }
      }

      // for each user, find the userTask document with the
      // user id, task id and season id
      // if the userTask document does not exist, create one
      // if the userTask document exists, fetch the 'xpEarned'
      // array
      // find if an entry for the prepTerm exists in the
      // 'xpEarned' array
      // if the entry exists, do nothing and continue to the
      // next user
      // if the entry does not exist, fetch the
      // amount for the user at the provided block height
      // and update the 'xpEarned' array with the new entry
      // and update the userTask document with the new
      // 'xpEarned' array
      //
      for (const validUser of filteredUsers) {
        console.log("Search userTask document");
        const userTaskDocArr = await getUserTaskByAllIds(
          validUser._id,
          targetTask._id,
          activeSeason._id,
          db.connection,
        );
        const userTaskDoc = userTaskDocArr[0];

        const xpArray = [];

        // if userTask document exists, fetch the xpEarned array
        if (userTaskDoc != null && userTaskDoc.xpEarned.length > 0) {
          if (targetTask.type === "non-recursive") {
            console.log("non-recursive task");
            // if the task is non-recursive, do nothing
            // and continue to the next user being in this
            // step in the logic means that the user has
            // already earned XP for this task
            continue;
          }
          // find if an entry for the prepTerm exists in the 'xpEarned' array
          // in other words check if the user has already earned XP for the current term
          const alreadyExists = userTaskDoc.xpEarned.find((xpEarned) => {
            return xpEarned.period === prepTerm;
          });

          if (alreadyExists != null) {
            // if the entry exists, do nothing and continue to the next user
            console.log(
              `UserTask document for user ${validUser._id} and task ${targetTask._id} and season ${activeSeason._id} already has an entry for prepTerm ${prepTerm}, with marked block height of ${alreadyExists.block}, and earned XP of ${alreadyExists.xp}`,
            );
            continue;
          } else {
            // if the entry does not exist, fetch all the existing entries (these are for the previous terms)
            xpArray.push(...userTaskDoc.xpEarned);
          }
        }

        // fetch amount for user for this current term
        console.log(`\n> Fetching amount for user ${validUser.walletAddress}`);
        const callbackResponse = await callback(
          validUser.walletAddress,
          height,
        );

        let amount = 0;
        if (callbackResponse == null) {
          console.log(
            `No amount found for user ${validUser.walletAddress} at block ${height}`,
          );
        } else {
          // TODO: this requires type and error checking,
          // first evaluate if the object exists then
          // do the math operation and evaluate if NaN is
          // returned, etc
          console.log("amount found for user, calculating earned XP");
          amount = callbackResponse;
          console.log("value in USD: ", amount);
        }

        console.log("Updating userTask document with new xpEarned array");
        // here we are adding the new entry for the current term to the xpEarned array. At this point the xpEarned array contains all the previous terms and we are adding the current term to it
        xpArray.push({
          period: prepTerm,
          block: height,
          xp: rewardFormula(amount),
        });

        // Update userTask document with new xpEarned array
        // at this point we got the xpEarned array with all the previous terms and we added the current term to it
        await updateOrCreateUserTask(
          {
            userId: validUser._id,
            taskId: targetTask._id,
            seasonId: activeSeason._id,
          },
          { xpEarned: xpArray },
          db.connection,
        );
        console.log("UserTask document updated");
      }
    }
    // close connection to DB here at the end
    // of the code logic if the code runs successfully
    console.log("Closing connection to DB");
    await db.stop();
  } catch (err) {
    console.log("Error running genericTask ");
    console.log(err.message);

    // close connection to DB here if an error occurs
    console.log("Closing connection to DB");
    await db.stop();
    throw new Error(err);
  }
}

module.exports = genericTask;
