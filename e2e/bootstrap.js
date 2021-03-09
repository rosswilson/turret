const server = require("../src/server");
const database = require("../src/dal/database");

async function bootstrap() {
  return new Promise((resolve) => {
    server.listen(3000, async () => {
      await database.init();

      resolve();
    });
  });
}

async function teardown() {
  return new Promise((resolve) => {
    server.close();

    database.sequelize.close();

    resolve();
  });
}

module.exports = { bootstrap, teardown };
