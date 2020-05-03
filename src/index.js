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
app.set("views", path.join(__dirname, "views"));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

const options = {
  key: fs.readFileSync("./certs/tls/turret.localhost-key.pem"),
  cert: fs.readFileSync("./certs/tls/turret.localhost.pem"),
};

https
  .createServer(options, app)
  .listen(port, () =>
    console.log(`Turret service listening at https://turret.localhost:3000`)
  );
