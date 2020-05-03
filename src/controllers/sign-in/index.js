const validate = require("../../dal/sign-in/validate");
const authenticate = require("../../dal/sign-in/authenticate");
const { generateSsoToken } = require("../../dal/sign-in");
const { setSsoTokenCookie } = require("../helpers");

const TITLE = "Sign In | Turret";

function render(response, options = {}) {
  const { error } = options;

  response.render("sign-in/index", {
    title: TITLE,
    error,
  });
}

function index(request, response) {
  return render(response);
}

async function create(request, response) {
  const { error, value } = validate(request.body);

  if (error) {
    response.status(400);

    return render(response, {
      error: "Those details don't look right, please try again.",
    });
  }

  const { success, userId } = await authenticate(value);

  if (success) {
    const token = await generateSsoToken(userId);

    setSsoTokenCookie(response, token);

    response.redirect("/");
  }

  response.status(401);

  return render(response, {
    error: "Either the email address or password were incorrect.",
  });
}

module.exports = { index, create };
