const { multi } = require("../../../common/services/v1");
const { dbWrapper } = require("./utils");

const getSeason = async (req, res) => {
  try {
    const data = await dbWrapper(
      multi.getCustomSeasonData,
      req.params.seasonLabel,
    );
    res.json(data);
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

const calculateSeason = async (req, res) => {
  try {
    const { seasonLabel } = req.params;
    const { total, baseline, filter } = req.body;

    if (total == null || baseline == null) {
      throw new Error("Invalid request");
    }

    const data = await dbWrapper(
      multi.calculateSeason,
      seasonLabel,
      total,
      baseline,
      filter,
    );

    res.json(data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getSeason,
  getTaskBySeason,
  calculateSeason,
};
