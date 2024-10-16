//
const MainDb = require("../../common/utils/mainDb");
const config = require("../../common/utils/config");
const { userService } = require("../../common/services/v1");
const { getAllUsers, addLinkedWalletToUser } = userService;

const params = { ...config.mongoParams };

const db = new MainDb(params);
const userWallet = "hxe70351dce99ef6bb0573765e541b77ce22409896";
const linkedWallets = [
  {
    address: "injective-1/inj1arzzjhnsy6wqw6mzsy49w5slawrwxrljwya4tq",
    type: "evm",
  },
  {
    address: "injective-1/inj17uvp6ku8r5v2xd98gkymxunxed8pj4tjeccnsz",
    type: "evm",
  },
];

async function foo() {
  const users = await getAllUsers(db.connection);
  users.map((user) => {
    if (user.walletAddress === userWallet) {
      console.log("User:");
      // console.log(JSON.stringify(user, null, 2));
      console.log(user);
    }
  });
}

async function main() {
  try {
    console.log("- Creating connetion to DB");
    await db.createConnection();

    await foo();

    for (const xchainWallet of linkedWallets) {
      const linkedWallet = {
        address: xchainWallet.address,
        type: xchainWallet.type,
      };
      console.log("Adding linked wallet to user: ", userWallet);
      await addLinkedWalletToUser(userWallet, linkedWallet, db.connection);
    }

    await foo();
    // closing connection to db
    console.log("- Closing connection to DB");
    await db.stop();
  } catch (err) {
    console.log("Error in dummy-addLinkedWalet.js:");
    console.log(err);

    // closing connection to db
    console.log("- Closing connection to DB");
    await db.stop();
  }
}

main();
