const express = require("express");
const rootController = require("../controllers/root");

const router = express.Router();

router.get("/", rootController.index);

module.exports = router;
