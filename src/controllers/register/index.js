const validate = require("../../dal/register/validate");
const persist = require("../../dal/register/persist");
const { generateSsoToken } = require("../../dal/sign-in");

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
      error: "Oops, please complete all the fields",
    });
  }

  try {
    const { userId } = await persist(value);

    const token = await generateSsoToken(userId);

    response.cookie("turret-sso", token, {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 2,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

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
