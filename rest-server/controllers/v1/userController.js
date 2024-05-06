// const { userService } = require("../../services/v1");
const { userService } = require("../../../common/services/v1");

const getUserAllSeasons = async (req, res) => {
  try {
    const data = await userService.getUserAllSeasons(req.params.userWallet);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserBySeason = async (req, res) => {
  try {
    const data = await userService.getUserBySeason(
      req.params.userWallet,
      req.params.season,
    );
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getUserAllSeasons,
  getUserBySeason,
};
