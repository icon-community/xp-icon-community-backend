// const { multi } = require("../../../common/services/v1");
// const { dbWrapper } = require("./utils");

const getSeason = async (req, res) => {
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

const getTaskBySeason = async (req, res) => {
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

module.exports = {
  getSeason,
  getTaskBySeason,
};
