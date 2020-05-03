const express = require("express");
const statusRoutes = require("./status");
const registerRoutes = require("./register");
const rootRoutes = require("./root");
const signInRoutes = require("./sign-in");

const router = express.Router();

router.use("/", rootRoutes);
router.use("/status", statusRoutes);
router.use("/register", registerRoutes);
router.use("/sign-in", signInRoutes);

module.exports = router;
