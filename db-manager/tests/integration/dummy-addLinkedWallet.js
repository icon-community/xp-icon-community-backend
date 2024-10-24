//
const MainDb = require("../../common/utils/mainDb");
const config = require("../../common/utils/config");
const { userService } = require("../../common/services/v1");
const { getAllUsers, addLinkedWalletToUser } = userService;

const params = { ...config.mongoParams };

const db = new MainDb(params);
const userWallet = "hx191e87b17bc2265953677f1201653b00fe87881f";
const linkedWallets = [
  {
    address: "0x3B66Bf513CB1D89966d9f2f7a985E2019ed54eb0",
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
