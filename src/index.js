require("dotenv").config();

const path = require("path");
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

app.listen(port, () =>
  console.log(`Turret service listening at http://localhost:${port}`)
);
