const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const AuthCode = require("../models/authCode");

const CODE_LENGTH_IN_BYTES = 24;

function generateToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(CODE_LENGTH_IN_BYTES, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("base64"));
      }
    });
  });
}

async function create(payload) {
  const { audience, clientId, redirectUri, scope, userId } = payload;

  try {
    const authCode = await generateToken();

    const params = {
      id: uuidv4(),
      audience,
      authCode,
      clientId,
      redirectUri,
      scope,
      userId,
    };

    console.debug("Recording authorisation code in database", params);

    await AuthCode.create(params);

    return authCode;
  } catch (error) {
    console.error("Error when issuing authorisation code", error);

    throw error;
  }
}

module.exports = create;
