require("dotenv").config();

const path = require("path");
const https = require("https");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "views"));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(router);

function readRelativeFile(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, relativePath));
}

const options = {
  key: readRelativeFile("../certs/tls/turret.localhost-key.pem"),
  cert: readRelativeFile("../certs/tls/turret.localhost.pem"),
};

module.exports = https.createServer(options, app);
