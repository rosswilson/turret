const AuthCode = require("../../dal/models/authCode");

async function create(request, response) {
  const {
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  } = request.body;

  if (grantType !== "authorization_code") {
    return response.status(422).json({
      error: "Turret only supports the authorization_code grant_type right now",
    });
  }

  if (clientSecret !== "secret") {
    return response.status(400).json({
      error:
        'For demonstration purposes the client_secret must equal \'"secret"',
    });
  }

  const authCode = AuthCode.findOne({
    where: { authCode: code, clientId, redirectUri },
  });

  if (authCode) {
    response.json({
      access_token: "TODO",
      refresh_token: "TODO",
      id_token: "TODO",
      token_type: "Bearer",
    });
  } else {
    response.status(400).json({
      error: "Unable to find an AuthCode with those details",
    });
  }
}

module.exports = { create };
