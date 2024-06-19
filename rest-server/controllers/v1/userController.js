const { multi } = require("../../../common/services/v1");
const mainDb = require("../../../utils/mainDb");
const config = require("../../../utils/config");

const params = {};
if (process.env.NODE_ENV === "dev") {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@localhost:27017`;
}

if (process.env.MONGO_CONTAINER != null) {
  params.uri = `mongodb://${config.db.user}:${config.db.pwd}@${process.env.MONGO_CONTAINER}:27017`;
}

const db = new mainDb(params);

const getUserAllSeasons = async (req, res) => {
  try {
    // const data = await dbWrapper(
    //   multi.getUserAllSeasons,
    //   req.params.userWallet,
    // );
    // res.json(data);
    res.json({ message: "Not implemented" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getUserBySeason = async (req, res) => {
  try {
    const data = await dbWrapper(
      multi.getUserBySeason,
      req.params.userWallet,
      req.params.season,
    );
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

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
  getUserAllSeasons,
  getUserBySeason,
};
