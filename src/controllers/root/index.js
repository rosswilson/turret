function index(request, response) {
  response.render("root/index", { title: "Turret" });
}

module.exports = { index };
