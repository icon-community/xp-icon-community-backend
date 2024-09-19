//
const mongoose = require("mongoose");

const IDS = {
  seasons1: new mongoose.Types.ObjectId(),
  tasks1: new mongoose.Types.ObjectId(),
  tasks2: new mongoose.Types.ObjectId(),
  tasks3: new mongoose.Types.ObjectId(),
  users1: new mongoose.Types.ObjectId(),
  users2: new mongoose.Types.ObjectId(),
};

const users = [
  {
    _id: IDS.users1,
    walletAddress: "0x1234567890",
    registrationBlock: 1,
    updatedAtBlock: 2,
    seasons: [
      {
        seasonId: IDS.seasons1,
        registrationBlock: 1,
        referrals: [],
      },
    ],
  },
  {
    _id: IDS.users2,
    walletAddress: "0x0987654321",
    registrationBlock: 2,
    updatedAtBlock: 2,
    seasons: [
      {
        seasonId: IDS.seasons1,
        registrationBlock: 1,
        referrals: [],
      },
    ],
  },
];

const seasons = [
  {
    _id: IDS.seasons1,
    number: 1,
    blockStart: "0x64",
    blockEnd: "0xc8",
    active: true,
    contract: "cx01",
    tasks: [IDS.tasks1, IDS.tasks2, IDS.tasks3],
  },
  {
    _id: IDS.seasons2,
    number: 2,
    blockStart: "0x12c",
    blockEnd: "0x190",
    active: true,
    contract: "cx02",
    tasks: [IDS.tasks1, IDS.tasks2, IDS.tasks3],
  },
];

const tasks = [
  {
    _id: IDS.tasks1,
    seedId: "1",
    type: "type1",
    description: "long description of task of type 1",
    criteria: { foo: "foo", bar: "bar" },
    title: "title of the task of type 1",
    rewardFormula: ["reward formula of task of type 1"],
    chain: "icon",
    createdAt: new Date(),
  },
  {
    _id: IDS.tasks2,
    seed: "2",
    type: "type2",
    description: "long description of task of type 2",
    criteria: { foo: "foo", bar: "bar" },
    title: "title of the task of type 2",
    rewardFormula: ["reward formula of task of type 2"],
    chain: "icon",
    createdAt: new Date(),
  },
];

const userTasks = [
  {
    userId: IDS.users1,
    taskId: IDS.tasks1,
    seasonId: IDS.seasons1,
    status: "pending",
    xpEarned: [
      {
        xp: 11,
        block: 1,
        period: 1,
      },
    ],
    createdAt: new Date(),
    updatedAtBlock: 0,
  },
  {
    userId: IDS.users2,
    taskId: IDS.tasks1,
    seasonId: IDS.seasons1,
    status: "pending",
    xpEarned: [
      {
        xp: 110,
        block: 1,
        period: 1,
      },
    ],
    createdAt: new Date(),
    updatedAtBlock: 0,
  },
];

module.exports = {
  mockUsers: users,
  mockSeasons: seasons,
  mockTasks: tasks,
  mockUserTasks: userTasks,
};
