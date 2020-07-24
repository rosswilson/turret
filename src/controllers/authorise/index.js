const codeIssuer = require("../../dal/authorise/codeIssuer");

async function create(request, response) {
  const { sub } = response.locals.parsedJwt;

  const {
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state = "",
  } = request.query;

  const authorisationCode = await codeIssuer({
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
