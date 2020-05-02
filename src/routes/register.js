const express = require("express");
const registerController = require("../controllers/register");

const router = express.Router();

router.get("/", registerController.index);
router.post("/", registerController.create);

module.exports = router;
