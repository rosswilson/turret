const { signInSchema } = require("../schemas");

function validate(payload) {
  return signInSchema.validate(payload, { abortEarly: false });
}

module.exports = validate;
