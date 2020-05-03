const validate = require("../../dal/register/validate");
const persist = require("../../dal/register/persist");
const { generateSsoToken } = require("../../dal/sign-in");
const { setSsoTokenCookie } = require("../helpers");

const TITLE = "Register | Turret";

function render(response, options = {}) {
  const { initialValues = {}, error } = options;

  response.render("register/index", {
    title: TITLE,
    name: initialValues.name,
    email: initialValues.email,
    error,
  });
}

function index(request, response) {
  return render(response);
}

async function create(request, response) {
  const { error, value } = validate(request.body);

  if (error) {
    console.log("Failed user registration validation", error);

    response.status(400);

    return render(response, {
      initialValues: value,
      error: "Oops, please complete all the fields.",
    });
  }

  try {
    const { userId } = await persist(value);

    const token = await generateSsoToken(userId);

    setSsoTokenCookie(response, token);

    return response.redirect("/");
  } catch (error) {
    response.status(500);

    return render(response, {
      initialValues: value,
      error: "Sorry, something went wrong. Please try again.",
    });
  }
}

module.exports = { index, create };
