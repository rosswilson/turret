const codeIssuer = require("../../dal/authorise/codeIssuer");

async function create(request, response) {
  const { sub } = response.locals.parsedJwt;

  const {
    audience,
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    response_type: responseType,
    state = "",
  } = request.query;

  if (!responseType === "code") {
    return response.status(422).json({
      error: "Turret only supports the code response_type right now",
    });
  }

  const authorisationCode = await codeIssuer({
    audience,
    clientId,
    redirectUri,
    scope,
    userId: sub,
  });

  const parsedRedirectUri = new URL(redirectUri);

  const formattedRedirectUri = `${parsedRedirectUri.origin}${parsedRedirectUri.pathname}`;

  return response.redirect(
    `${formattedRedirectUri}?code=${authorisationCode}&state=${state}`
  );
}

module.exports = { create };
