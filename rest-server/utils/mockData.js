const mongoose = require("mongoose");
const users = [
  {
    _id: new mongoose.Types.ObjectId("6626edbcccfefb8bff08211d"),
    address: "hx0000000000000000000000000000000000000000",
    dailyCheckInStreak: 2,
    willEarnCheckInStreak: true,
    referrals: [new mongoose.Types.ObjectId("6626ec13e91bc8310e12cc84")],
    createdAt: new Date(1640995200 * 1000),
    updatedAt: new Date(1641081600 * 1000),
    seasons: [
      {
        seasonId: new mongoose.Types.ObjectId("6626ec203cbca472f1b27e94"),
        tasks: [
          {
            taskId: new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
            xpEarned: 11,
            status: "pending",
          },
          {
            taskId: new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
            xpEarned: 20,
            status: "pending",
          },
        ],
      },
      {
        seasonId: new mongoose.Types.ObjectId("6626ec241d85ce5d661e88a2"),
        tasks: [
          {
            taskId: new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
            xpEarned: 15,
            status: "pending",
          },
          {
            taskId: new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
            xpEarned: 23,
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    address: "hx0000000000000000000000000000000000000001",
    dailyCheckInStreak: 0,
    willEarnCheckInStreak: false,
    _id: new mongoose.Types.ObjectId("6626ec13e91bc8310e12cc84"),
    referrals: [],
    createdAt: new Date(1641168000 * 1000),
    updatedAt: new Date(1641254400 * 1000),
    seasons: [
      {
        seasonId: new mongoose.Types.ObjectId("6626ec203cbca472f1b27e94"),
        tasks: [
          {
            taskId: new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
            xpEarned: 110,
            status: "pending",
          },
          {
            taskId: new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
            xpEarned: 200,
            status: "pending",
          },
        ],
      },
      {
        seasonId: new mongoose.Types.ObjectId("6626ec241d85ce5d661e88a2"),
        tasks: [
          {
            taskId: new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
            xpEarned: 112,
            status: "pending",
          },
          {
            taskId: new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
            xpEarned: 2012,
            status: "pending",
          },
        ],
      },
    ],
  },
];

const tasks = [
  {
    _id: new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
    type: "type1",
    description: "long description of task of type 1",
    criteria: { info: "criteria for task of type 1" },
    title: "title of task 1",
    rewardFormula: "reward formula for task 1",
    createdAt: new Date(1640995199) * 1000,
  },
  {
    _id: new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
    type: "type2",
    description: "long description of task of type 2",
    criteria: { info: "criteria for task of type 2" },
    title: "title of task 2",
    rewardFormula: "reward formula for task 2",
    createdAt: new Date(1640995190 * 1000),
  },
];

const seasons = [
  {
    _id: new mongoose.Types.ObjectId("6626ec203cbca472f1b27e94"),
    number: 1,
    blockStart: "0x100",
    blockEnd: "0x200",
    active: false,
    tasks: [
      new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
      new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
    ],
  },
  {
    _id: new mongoose.Types.ObjectId("6626ec241d85ce5d661e88a2"),
    number: 2,
    blockStart: "0x250",
    blockEnd: "0x350",
    active: true,
    tasks: [
      new mongoose.Types.ObjectId("6626ec1b98c8c85ea44a3bd2"),
      new mongoose.Types.ObjectId("6626ec1ebf9fc687f47d9df9"),
    ],
  },
];

module.exports = { users, tasks, seasons };
