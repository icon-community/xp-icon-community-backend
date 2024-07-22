const { seasonController } = require("../../controllers/v1");
const router = require("express").Router();

router.get("/:seasonLabel", seasonController.getSeason);
router.post("/:seasonLabel", seasonController.calculateSeason);
router.get("/:seasonLabel/task/:taskLabel", seasonController.getTaskBySeason);

module.exports = router;
