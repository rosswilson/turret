require("dotenv").config();

const path = require("path");
const https = require("https");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "views"));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

function readRelativeFile(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, relativePath));
}

const options = {
  key: readRelativeFile("../certs/tls/turret.localhost-key.pem"),
  cert: readRelativeFile("../certs/tls/turret.localhost.pem"),
};

https
  .createServer(options, app)
  .listen(port, () =>
    console.log(`Turret service listening at https://turret.localhost:3000`)
  );
