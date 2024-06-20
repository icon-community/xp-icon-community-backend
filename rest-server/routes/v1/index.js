const express = require("express");
const router = express.Router();

// Import v1 user routes
const userRoutes = require("./userRoutes");
const seasonRoutes = require("./seasonRoutes");

// Mount v1 user routes under /v1/user
router.use("/user", userRoutes);
router.use("/season", seasonRoutes);

module.exports = router;
