const db = {
  a: {
    user: {
      wallet: "0x1234567890abcdef",
      network: "ethereum",
      XPData: {
        seasons: [
          {
            seasonNumber: 1,
            seasonXP: 11
          },
          {
            seasonNumber: 2,
            seasonXP: 1
          }
        ],
        totalXP: 12
      }
    },
    tasks: [
      {
        id: 1,
        description: "Task 1 for season 1",
        summary: "This is a long description of task 1 for season 1",
        season: 1
      },
      {
        id: 2,
        description: "Task 1 for season 2",
        summary: "This is a long description of task 1 of season 2",
        season: 2
      }
    ]
  },
  b: {
    user: {
      wallet: "0x1234567890abcdef",
      network: "ethereum",
      XPData: {
        seasons: [
          {
            seasonNumber: 1,
            seasonXP: 11
          }
        ]
      }
    },
    tasks: [
      {
        id: 1,
        description: "Task 1 for season 1",
        summary: "This is a long description of task 1 for season 1",
        season: 1
      }
    ]
  }
};

module.exports = db;
