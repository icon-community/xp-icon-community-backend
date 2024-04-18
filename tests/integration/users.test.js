const assert = require("assert");
const MockDb = require("../../config/mockDb");
const mockUsers = require("../mockData/users");
const {
  createUser,
  getAllUsers,
} = require("../../rest-server/services/v1/userService");

describe("User Collection", () => {
  const db = new MockDb();
  before(async () => {
    await db.createConnection();
  });

  after(async () => {
    await db.stop();
  });

  it("should insert a doc into collection", async () => {
    const user = mockUsers[0];
    const response = await createUser(user, db.connection);
    assert.equal(response.walletAddress, user.walletAddress);
  });
});
