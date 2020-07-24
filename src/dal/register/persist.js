const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 8;

async function create(payload) {
  const { name, email, password } = payload;

  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const params = { id: userId, name, email: email.toLowerCase(), passwordHash };

  console.debug("Recording user in database", params);

  try {
    await User.create(params);

    return { userId };
  } catch (error) {
    console.error("Error when persisting user into database", error);

    throw error;
  }
}

module.exports = create;
