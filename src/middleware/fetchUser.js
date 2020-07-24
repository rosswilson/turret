const User = require("../dal/models/user");

async function fetchUser(request, response, next) {
  function redirectToSignIn() {
    response.redirect("/sign-in");
  }

  const { parsedJwt } = response.locals;

  if (!parsedJwt) {
    throw new Error(
      "Missing parsed JWT on locals. Ensure the verifyJwt middleware has been called before this one."
    );
  }

  const user = await User.findByPk(parsedJwt.sub);

  if (user) {
    response.locals.currentUser = user;

    console.log("response.locals", response.locals.currentUser.id);
  } else {
    console.error(`Could not find user with id = ${parsedJwt.sub}`);

    // TODO clear the turret-sso cookie as it belongs to a user that has since been deleted?

    return redirectToSignIn();
  }

  return next();
}

module.exports = fetchUser;
