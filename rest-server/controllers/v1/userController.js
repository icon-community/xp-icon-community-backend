const { multi } = require("../../../common/services/v1");
const { dbWrapper } = require("./utils");

const getUserAllSeasons = async (req, res) => {
  try {
    // const data = await dbWrapper(
    //   multi.getUserAllSeasons,
    //   req.params.userWallet,
    // );
    // res.json(data);
    throw new Error("Not implemented");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getUserBySeason = async (req, res) => {
  try {
    const data = await dbWrapper(
      multi.getUserBySeason,
      req.params.userWallet,
      req.params.seasonId,
    );
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
};
