const mainDb = require("../../../utils/mainDb");
const config = require("../../../utils/config");

const params = { ...config.mongoParams };

const db = new mainDb(params);

async function dbWrapper(callback, ...args) {
  try {
    await db.createConnection();
    const data = await callback(...args, db.connection);
    await db.stop();
    return data;
  } catch (error) {
    await db.stop();
    console.log("error");
    console.log(error);
    throw error;
  }
}

module.exports = {
  dbWrapper,
};
