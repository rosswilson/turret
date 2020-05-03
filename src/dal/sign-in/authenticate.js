const DynamoDB = require("aws-sdk/clients/dynamodb");
const bcrypt = require("bcrypt");

async function authenticate(payload) {
  const documentClient = new DynamoDB.DocumentClient({
    endpoint: "http://localhost:8000",
    region: "eu-west-1",
  });

  const { email, password } = payload;

  const params = {
    TableName: "Users",
    Key: {
      Identifier: email.toLowerCase(),
    },
  };

  let user;

  try {
    const { Item } = await documentClient.get(params).promise();

    if (Item.Identifier) {
      user = Item;
    }
  } catch (error) {
    console.error("Error when fetching user from database", error);

    throw error;
  }

  if (!user) {
    await bcrypt.compare(password, "dummyPasswordToPreventTimingAttacks");

    return { success: false };
  }

  const isCorrectPassword = await bcrypt.compare(password, user.PasswordHash);

  return isCorrectPassword
    ? { success: true, userId: user.ID }
    : { success: false };
}

module.exports = authenticate;
