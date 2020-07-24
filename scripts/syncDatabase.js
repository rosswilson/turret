require("dotenv").config();

const database = require("../src/dal/database");

require("../src/dal/models");

async function run() {
  await database.init();

  await database.sequelize.sync({ alter: true });
}

run()
  .then(() => {
    console.log("Database has been syncronised");

    process.exit(0);
  })
  .catch((error) =>
    console.error("An error occurred when syncing the database", error)
  );
