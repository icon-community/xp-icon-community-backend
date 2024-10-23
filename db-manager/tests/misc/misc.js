//
const MainDb = require("../../common/utils/mainDb");
const config = require("../../common/utils/config");
const {
  userService,
  taskService,
  userTaskService,
} = require("../../common/services/v1");

// setup mongo connection params for dev env testing
config.mongoParams.uri = "mongodb://root:pwd@localhost:27017";
const params = { ...config.mongoParams };

const db = new MainDb(params);
// const userWallet = "hxe70351dce99ef6bb0573765e541b77ce22409896";
// const linkedWallets = [
//   {
//     address: "injective-1/inj1arzzjhnsy6wqw6mzsy49w5slawrwxrljwya4tq",
//     type: "evm",
//   },
//   {
//     address: "injective-1/inj17uvp6ku8r5v2xd98gkymxunxed8pj4tjeccnsz",
//     type: "evm",
//   },
// ];

async function main() {
  try {
    // creating connection to DB
    console.log("- Creating connetion to DB");
    await db.createConnection();

    // Execute main tests here
    const allUserTasks = await userTaskService.getAllUserTasks(db.connection);

    allUserTasks.map((userTask) => {
      console.log("-----------------");
      console.log(`userId: ${userTask.userId}`);
      console.log(`taskId: ${userTask.taskId}`);
      console.log(`walletAddress: ${userTask.walletAddress}`);
      console.log("xpEarned:");
      console.log(userTask.xpEarned);
    });

    // closing connection to db
    console.log("- Closing connection to DB");
    await db.stop();
  } catch (err) {
    console.log("Error in main");
    console.log(err);

    // closing connection to db
    console.log("- Closing connection to DB");
    await db.stop();
  }
}

main();
