//
const tasks = [
  {
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

module.exports = tasks;
