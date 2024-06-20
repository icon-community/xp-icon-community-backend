const { seasonController } = require("../../controllers/v1");
const router = require("express").Router();

router.get("/:seasonId", seasonController.getSeason);
router.get("/:seasonId/task/:taskId", seasonController.getTaskBySeason);

module.exports = router;
