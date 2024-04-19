const assert = require("assert");
const MockDb = require("../../config/mockDb");
const mockSeasons = require("../mockData/seasons");
const {
  createSeason,
  getAllSeasons,
} = require("../../rest-server/services/v1/seasonService");

describe("Season Collection", () => {
  const db = new MockDb();
  before(async () => {
    await db.createConnection();
  });

  after(async () => {
    await db.stop();
  });

  it("should create a season", async () => {
    const season = await createSeason(mockSeasons[0], db.connection);
    assert.equal(season.blockStart, mockSeasons[0].blockStart);
  });

  it("should get all seasons added in the collection", async () => {
    const response = await getAllSeasons(db.connection);
    assert.equal(response.length, 1);
  });
});
