const crypto = require("crypto");
const DynamoDB = require("aws-sdk/clients/dynamodb");

const CODE_LENGTH_IN_BYTES = 48;

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
  const { clientId, redirectUri, scope } = payload;

  try {
    const documentClient = new DynamoDB.DocumentClient({
      endpoint: "http://localhost:8000",
      region: "eu-west-1",
    });

    const authCode = await generateToken();

    const params = {
      TableName: "AuthCodes",
      Item: {
        AuthCode: authCode,
        ClientId: clientId,
        RedirectUri: redirectUri,
        Scope: scope,
      },
    };

    console.debug("Recording authorisation code in database", params);

    await documentClient.put(params).promise();

    return authCode;
  } catch (error) {
    console.error("Error when issuing authorisation code", error);

    throw error;
  }
}

module.exports = create;
