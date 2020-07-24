const User = require("../models/user");
const bcrypt = require("bcrypt");

async function authenticate(payload) {
  const { email, password } = payload;

  const params = {
    where: {
      email: email.toLowerCase(),
    },
  };

  const user = await User.findOne(params);

  if (!user) {
    await bcrypt.compare(password, "dummyPasswordToPreventTimingAttacks");

    return { success: false };
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  return isCorrectPassword
    ? { success: true, userId: user.id }
    : { success: false };
}

module.exports = authenticate;
