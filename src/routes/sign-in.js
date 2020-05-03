const express = require("express");
const signInController = require("../controllers/sign-in");

const router = express.Router();

router.get("/", signInController.index);
router.post("/", signInController.create);

module.exports = router;
