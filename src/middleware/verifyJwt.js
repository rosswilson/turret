const { verifySsoToken } = require("../dal/sign-in");

async function parseToken(token) {
  try {
    return await verifySsoToken(token);
  } catch (error) {
    return undefined;
  }
}

async function verifyJwt(request, response, next) {
  function redirectToSignIn() {
    response.redirect("/sign-in");
  }

  const jwtToken = request.cookies["turret-sso"];

  if (!jwtToken) {
    console.log("Missing turret-sso JWT token cookie");

    return redirectToSignIn();
  }

  const parsedToken = await parseToken(jwtToken);

  if (parsedToken) {
    response.locals.parsedJwt = parsedToken;
  } else {
    console.error("Unable to parse turret-sso JWT token");

    // TODO clear the turret-sso cookie as it's invalid?

    return redirectToSignIn();
  }

  return next();
}

module.exports = verifyJwt;
