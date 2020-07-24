const express = require("express");

const rootController = require("./controllers/root");
const signInController = require("./controllers/sign-in");
const registerController = require("./controllers/register");
const authoriseController = require("./controllers/authorise");
const tokensController = require("./controllers/tokens");
const statusController = require("./controllers/status");

const verifyJwt = require("./middleware/verifyJwt");
const fetchUser = require("./middleware/fetchUser");

const router = express.Router();

router.get("/", rootController.index);

router.get("/sign-in", signInController.index);
router.post("/sign-in", signInController.create);

router.get("/register", registerController.index);
router.post("/register", registerController.create);

router.get("/authorise", [verifyJwt, fetchUser, authoriseController.create]);

router.post("/tokens", tokensController.create);

router.get("/status", statusController.index);

module.exports = router;
