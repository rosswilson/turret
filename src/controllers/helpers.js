function setSsoTokenCookie(response, token) {
  response.cookie("turret-sso", token, {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 2,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
}

module.exports = { setSsoTokenCookie };
