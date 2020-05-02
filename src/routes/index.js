const express = require("express");
const statusRoutes = require("./status");
const registerRoutes = require("./register");
const rootRoutes = require("./root");

const router = express.Router();

router.use("/", rootRoutes);
router.use("/status", statusRoutes);
router.use("/register", registerRoutes);

module.exports = router;
