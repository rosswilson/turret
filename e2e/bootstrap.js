const server = require("../src/server");
const database = require("../src/dal/database");

function bootstrap(done) {
  server.listen(3000, async () => {
    await database.init();

    done();
  });
}

function teardown(done) {
  server.close();

  database.sequelize.close();

  done();
}

module.exports = { bootstrap, teardown };
