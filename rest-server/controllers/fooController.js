const fooService = require("../services/foo");

const getFoo = async (req, res) => {
  try {
    const foo = await fooService.getFoo();
    res.json(foo);
  } catch (error) {
    res.status(500).send("ERROR DAMN");
    // res.status(500).send(error);
  }
};
module.exports = {
  getFoo
};
