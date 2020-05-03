const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 8;

async function create(payload) {
  const documentClient = new DynamoDB.DocumentClient({
    endpoint: "http://localhost:8000",
    region: "eu-west-1",
  });

  const { name, email, password } = payload;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const userId = uuidv4();

  const params = {
    TableName: "Users",
    Item: {
      Identifier: email.toLowerCase(),
      ID: userId,
      Name: name,
      PasswordHash: passwordHash,
    },
  };

  console.debug("Recording user in database", JSON.stringify({ params }));

  try {
    await documentClient.put(params).promise();

    return { userId };
  } catch (error) {
    console.error("Error when persisting user into database", error);

    throw error;
  }
}

module.exports = create;
