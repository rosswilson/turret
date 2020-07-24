const server = require("./server");
const database = require("./dal/database");

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Turret service listening at https://turret.localhost:3000`);

  database.init();
});
