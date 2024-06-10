//
const mongoose = require("mongoose");

const users = [
  {
    walletAddress: "0x1234567890",
    registrationBlock: 1,
    updatedAtBlock: 2,
    seasons: [
      {
        seasonId: new mongoose.Types.ObjectId(),
        registrationBlock: 1,
        referrals: [],
      },
    ],
  },
  {
    walletAddress: "0x0987654321",
    registrationBlock: 2,
    updatedAtBlock: 2,
  },
];

module.exports = users;
