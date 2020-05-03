const { readFile } = require("fs").promises;

const path = require("path");
const jwt = require("jsonwebtoken");

async function getSigningKey() {
  try {
    const keyPath = path.resolve(
      __dirname,
      "../../../certs/signing/ec_key.pem"
    );

    return await readFile(keyPath);
  } catch (error) {
    console.error("Error reading JWT signing private key from disk", error);

    throw error;
  }
}

async function generateSsoToken(userId) {
  if (!userId) {
    throw Error("A user ID must be supplied when generating a SSO token");
  }

  const privateKey = await getSigningKey();

  return jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "2y",
    audience: "turret-sso",
    issuer: "turret-sso",
    subject: userId,
  });
}

module.exports = { generateSsoToken };
