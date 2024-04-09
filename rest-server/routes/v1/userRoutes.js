const { userController } = require("../../controllers/v1");
const router = require("express").Router();

router.get("/:userWallet", userController.getUserAllSeasons);
router.get("/:userWallet/:season", userController.getUserBySeason);

module.exports = router;
