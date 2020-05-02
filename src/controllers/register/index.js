const { validate } = require("../../dao/register");

const TITLE = "Register | Turret";

function index(request, response) {
  response.render("register/index", { title: TITLE });
}

function create(request, response) {
  const { error, value } = validate(request.body);

  if (error) {
    console.log("Error registering new user", error);

    return response.render("register/index", {
      title: TITLE,
      name: value.name,
      email: value.email,
      error: "Oops, please complete all the fields",
    });
  }

  console.log("TODO register a new user", value);

  response.redirect("/");
}

module.exports = { index, create };
