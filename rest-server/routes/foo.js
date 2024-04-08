const controllers = require("../controllers");
const router = require("express").Router();

router.get("/", controllers.fooControllers.getFoo);

module.exports = router;
